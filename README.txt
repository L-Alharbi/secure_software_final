-----TO RUN THE SERVER-----
clone the repo, go into VScode
make sure you have node.js installed
in VScode install the npm packages listed below from the console (eg: npm install nodemon)
then run the console command to start the server (shown below)
if it works the console will print "connected to database   server is running on port 3000"
go to your internet browser at http://localhost:3000/ to see if it worked

download requirements:
node.js

npm install:
nodemon
mongoose
express

start server:
npm run dev




-----API ENDPOINTS-----
http://localhost:3000/api/products
-GET: get all products
-POST: add new product

http://localhost:3000/api/product/<id>
-GET: get by id
-PUT: update by id
-DELETE: delete by id



-----DATABASE INFO-----
We're using mongodb atlas which is a cloud based database
so you shouldn't have to configure anything, that is all handle in the code already
but if you have issues with database access lmk
-Username: ezra8473
-Password: 5E4qyntirsiIVdPm

-----EXAMPLE JSON-----
{
	"name":"gyro",
	"quantity":10,
	"price":3.99
}