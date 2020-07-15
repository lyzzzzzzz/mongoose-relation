const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/mongo-relation', { useNewUrlParser: true, useUnifiedTopology: true })

const PostSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }, //存的是id,关联到Category表
  categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }] //存多个分类
})
const CategorySchema = new mongoose.Schema({
  name: { type: String }
},{
  toJSON:{virtuals:true}
})

CategorySchema.virtual('posts', {
  localField: '_id', //Category表的id
  ref: 'Post',  //关联到Post表
  foreignField: 'categories', //关联的字段
  justOne: false //是否查询一条
})

const Post = mongoose.model('Post', PostSchema)  //建表--文章表
const Category = mongoose.model('Category', CategorySchema)//建表--分类表



//通过分类查询文章，，需要创建虚拟字段--CategorySchema.virtual
async function getPostByCate() {
  const cates = await Category.find().populate('posts')
  console.log(JSON.stringify(cates));  //JSON.stringify(cates)  需先设置toJSON:{virtuals:true}
}
getPostByCate()




// //把分类关联到文章
async function getPost() {
  const cate1 = await Category.findById("5f0ec441fa2d1e20c02d41dd")
  const cate2 = await Category.findById("5f0ec441fa2d1e20c02d41de")
  const post1 = await Post.findById("5f0ec0d68c658d25b410c09c")
  const post2 = await Post.findById("5f0ec53ef91fae324018ceb0")
  // post1.category=cate1
  // post2.category=cate1
   post1.categories=[cate1,cate2]
  post2.categories=[cate2]
  await post1.save()
  await post2.save()

  const data =await Post.find().populate('categories')  //populate把关联的信息带出来

  console.log(data[0],data[1]);
}
// getPost()