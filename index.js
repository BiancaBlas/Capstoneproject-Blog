import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let blogList = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// homepage
app.get("/", (req, res) => {
	res.render("index.ejs");
});

// page with all the blogs
app.get("/blogList", (req, res) => {
	res.render("blogList.ejs", { blogList: blogList });
});

// post blog
app.post("/blogList", (req, res) => {
	var name = req.body.name;
	var title = req.body["title"]; //aperantly you can do .title as well...
	var text = req.body["text"];
	blogList.push({
		id: generateID(),
		name: name,
		title: title,
		text: text,
	});
	res.render("blogList.ejs", { blogList: blogList });
});
// Function to generate random ID
function generateID() {
	return Math.floor(Math.random() * 10000);
}

// blog details
app.get("/details/:id", (req, res) => {
	var blogId = req.params.id;
	var blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
	res.render("details.ejs", { blogDetails: blogDetails });
});

// edit blog
app.get("/edit/:id", (req, res) => {
	var blogId = req.params.id;
	var blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
	res.render("index.ejs", { isEdit: true, blogDetails: blogDetails });
});

// update blog
app.post("/edit/:id", (req, res) => {
	var blogId = req.params.id;
	var editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
	if (editBlog === -1) {
		res.send("<h1>There seems to be something wrong<h1>");
	}
	var updatedName = req.body.name;
	var updatedTitle = req.body.title;
	var updatedText = req.body.text;

	var name = (blogList[editBlog].name = updatedName);
	var title = (blogList[editBlog].title = updatedTitle);
	var text = (blogList[editBlog].text = updatedText);
	[...blogList, { name: name, title: title, text: text }];

	res.render("blogList.ejs", { isEdit: true, blogList: blogList });
});

//delete blog
app.post("/delete/:id", (req, res) => {
	const blogId = req.params.id;
	blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
	res.redirect("/blogList");
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
