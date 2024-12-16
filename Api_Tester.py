import requests
import json
import itertools
import time

# Define extreme test cases for different data types
EXTREME_TEST_CASES = {
    "int": [0, -1, 2**31, -(2**31), "string_instead", None],
    "str": ["", "a" * 1000, "<script>alert('xss')</script>", "' OR '1'='1", None],
    "float": [0.0, -1.1, 1e308, -1e308, "string_instead"],
    "bool": [True, False, "true", "false", "not_bool"],
    "json": [{}, {"key": "value"}, "invalid_json", None],
}

success_count = 0
failure_count = 0
test_results = []  # To store all test results

# Function to generate combinations of extreme inputs
def generate_test_cases(params):
    param_names = params.keys()
    extreme_values = [EXTREME_TEST_CASES.get(p_type, [None]) for p_type in params.values()]
    return [dict(zip(param_names, values)) for values in itertools.product(*extreme_values)]

# Replace ':id' dynamically with actual product IDs
def replace_id_in_url(url, id):
    return url.replace(":id", str(id))

# Fetch product IDs for testing
def fetch_product_ids():
    try:
        response = requests.get("http://localhost:3000/api/products")
        if response.status_code == 200:
            return [product['_id'] for product in response.json()]  # Use '_id' instead of 'id'
        else:
            print("Failed to fetch product IDs.")
            return []
    except Exception as e:
        print(f"Error fetching product IDs: {e}")
        return []

# Load API configuration (endpoints and their parameters)
with open("api_config.json", "r") as f:
    api_config = json.load(f)

# Function to test endpoints
def test_endpoints():
    global success_count, failure_count
    start_time = time.time()  # Start the timer

    product_ids = fetch_product_ids()

    for endpoint in api_config:
        url = endpoint["url"]
        method = endpoint["method"].upper()
        params = endpoint.get("params", {})
        headers = endpoint.get("headers", {})

        test_cases = generate_test_cases(params)

        for test_case in test_cases:
            # Replace :id in URL if necessary
            if ":id" in url:
                if not product_ids:
                    print("No product IDs available to test dynamic URL.")
                    continue
                for product_id in product_ids:
                    test_url = replace_id_in_url(url, product_id)
                    send_request(method, test_url, test_case, headers)
            else:
                send_request(method, url, test_case, headers)

    end_time = time.time()  # End the timer
    print(f"Total execution time: {end_time - start_time} seconds")
    print(f"Test Summary: {success_count} successful tests, {failure_count} failed tests.")

    # Save all results to a log file
    with open("test_results.json", "w") as result_file:
        json.dump(test_results, result_file, indent=4)
    print("Test results saved to test_results.json.")

    # Save only failed tests to a separate file
    failed_results = [result for result in test_results if result.get("status_code", 0) >= 400]
    with open("failed_tests.json", "w") as failed_file:
        json.dump(failed_results, failed_file, indent=4)
    print("Failed tests saved to failed_tests.json.")

# Function to send a request and print results
def send_request(method, url, test_case, headers):
    global success_count, failure_count, test_results
    print(f"Testing {url} with {test_case}")
    try:
        start_time = time.time()
        if method == "GET":
            response = requests.get(url, params=test_case, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=test_case, headers=headers, timeout=10)
        elif method == "PUT":
            response = requests.put(url, json=test_case, headers=headers, timeout=10)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            print(f"Unsupported method {method} for {url}")
            return

        duration = time.time() - start_time
        result = {
            "url": url,
            "method": method,
            "test_case": test_case,
            "status_code": response.status_code,
            "response": response.text[:200],
            "response_time": duration,
        }
        test_results.append(result)

        print(f"Response: {response.status_code} - {response.text[:100]}...\n")
        if 200 <= response.status_code < 300:
            success_count += 1
        else:
            failure_count += 1
            print(f"Potential issue detected for {url} with input {test_case}")

    except Exception as e:
        failure_count += 1
        result = {
            "url": url,
            "method": method,
            "test_case": test_case,
            "error": str(e),
        }
        test_results.append(result)
        print(f"Error testing {url} with {test_case}: {e}")

if __name__ == "__main__":
    test_endpoints()
