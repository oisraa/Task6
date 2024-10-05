const http = require('http');
const fs = require("fs");
const express = require("express");  // Corrected require statement
const app = express();

// Middleware to parse JSON requests
        app.use(express.json());

// Read data from file
        function readDataFromFile(callback) {
        fs.readFile("data.json", "utf-8", (err, data) => {
        if (err) {
        console.error("Error reading file:", err);
        callback([]);
        return;
        }
        callback(JSON.parse(data));
        });
        }

// Write data to file
        function writeDataToFile(data, callback) {
        fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if (err) {
        console.error("Error writing to file:", err);
        return;
        }
        callback();
        });
        } 

// Get all posts
        app.get('/posts', (req, res) => {
        readDataFromFile((data) => {
     // res.send({ data: data });
        res.json(data);
        }) ;

        });

// create new post 
        app.post('/posts', (req, res)=>{
        readDataFromFile((dataThatReadFromFile)=>{
        dataThatReadFromFile.push(req.body);
        writeDataToFile(dataThatReadFromFile, ()=>{
        res.send({message: "Data saved successfully."})
        })
        })
          console.log(req.body); 
         })

 // Update a post
        app.put('/posts/:id', (req, res) => {
        const id = parseInt(req.params.id);

        readDataFromFile((data) => {
        const index = data.findIndex((item) => item.id === id);

        if (index !== -1) {
        const updatedPost = {
        ...data[index],  //save old data
        title: req.body.title || data[index].title,
        description: req.body.description || data[index].description,
        author: req.body.author || data[index].author,
        date: req.body.date || data[index].date
         };

         data[index] = updatedPost;

         writeDataToFile(data, () => {
         res.json({ message: "Post updated successfully", post: updatedPost });
         });
         } else {
         res.status(404).json({ message: 'Post not found' });
         }
         });
        });


// Delete post
        app.delete('/posts/:id', (req, res) => {
        const id = parseInt(req.params.id);

        readDataFromFile((data) => {
        const index = data.findIndex((item) => item.id === id);

        if (index !== -1) {
        const filteredData = data.filter((item) => item.id !== id);

        writeDataToFile(filteredData, () => {
        res.json({ message: "Post deleted successfully" });
            });
         } else {
        res.status(404).json({ message: 'Post not found' });
        }
        });
        });


// Start the server
       app.listen(3000, () => {
       console.log("Server running on port 3000");
       });


// const getPostsData = () => {
//     const data = fs.readFileSync('data.json', 'utf-8');
//     return JSON.parse(data);
//   };
  
  // كتابة البيانات إلى ملف data.json
//   const savePostsData = (data) => {
//     fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
//   };
  
  // 1. استعراض كل المنشورات
//   app.get('/posts', (req, res) => {
//     const posts = getPostsData();
//     res.json(posts);
//   });
  
  // 2. إنشاء منشور جديد
//   app.post('/posts', (req, res) => {
//     const posts = getPostsData();
//     const newPost = {
//       id: posts.length + 1, // إنشاء ID تلقائي
//       title: req.body.title,
//       description: req.body.description,
//       author: req.body.author,
//       date: new Date().toISOString()
//     };
//     posts.push(newPost);
//     savePostsData(posts);
//     res.status(201).json(newPost);
//   });
  
  // 3. تعديل منشور موجود مسبقاً
//   app.put('/posts/:id', (req, res) => {
//     const posts = getPostsData();
//     const postId = parseInt(req.params.id);
//     const postIndex = posts.findIndex(post => post.id === postId);
  
//     if (postIndex !== -1) {
//       const updatedPost = {
//         ...posts[postIndex],
//         title: req.body.title || posts[postIndex].title,
//         description: req.body.description || posts[postIndex].description,
//         author: req.body.author || posts[postIndex].author
//       };
//       posts[postIndex] = updatedPost;
//       savePostsData(posts);
//       res.json(updatedPost);
//     } else {
//       res.status(404).json({ message: 'Post not found' });
//     }
//   });
  
  // 4. حذف منشور
//   app.delete('/posts/:id', (req, res) => {
//     const posts = getPostsData();
//     const postId = parseInt(req.params.id);
//     const filteredPosts = posts.filter(post => post.id !== postId);
  
//     if (posts.length !== filteredPosts.length) {
//       savePostsData(filteredPosts);
//       res.json({ message: 'Post deleted successfully' });
//     } else {
//       res.status(404).json({ message: 'Post not found' });
//     }
//   });
  
  // بدء السيرفر
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });