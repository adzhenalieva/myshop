const mongoose = require('mongoose');
const config = require('./config');
const nanoid = require('nanoid');

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Subcategory = require('./models/Subcategory');

const run = async () => {
    await mongoose.connect(config.dbURL, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }
    const users = await User.create(
        {username: 'admin', password: '123', role: 'admin', token: nanoid(), address: 'admin', email: 'admin@mail.com'}

    );

    const categories = await Category.create(
        {title: 'Women', description: 'Women clothes', image: 'women.jpg'},
        {title: 'Men', description: 'Men clothes', image: 'men.jpg'},
        {title: 'Kids', description: 'Clothes for kids', image: 'forKids.jpeg'},
    );

    const subCategories = await Subcategory.create(
        {title: 'dresses', category: categories[0]._id},
        {title: 'jeans', category: categories[0]._id},
        {title: 'tops', category: categories[0]._id},
        {title: 'blazers', category: categories[1]._id},
        {title: 'jeans', category: categories[1]._id},
        {title: 'tops', category: categories[1]._id},
        {title: 'basic', category: categories[2]._id},
        {title: 'tops', category: categories[2]._id},
        {title: 'bottoms', category: categories[2]._id},
    );

    await Product.create(
        {title: 'Evening dress', price: 1700, description: 'For special occasions', category: categories[0]._id, subcategory: subCategories[0]._id, image: 'eveningDress.jpeg'},
        {title: 'Basic top', price: 770, description: 'Classic basic top', category: categories[0]._id, subcategory: subCategories[2]._id, image: 'topWomen.jpeg'},
        {title: 'Basic jeans', price: 970, description: 'Classic jeans', category: categories[0]._id, subcategory: subCategories[1]._id, image: 'jeansWomen.jpeg'},
        {title: 'Basic blazer', price: 7770, description: 'Classic blazer', category: categories[1]._id, subcategory: subCategories[2]._id, image: 'blazerMen.jpeg'},
        {title: 'Basic jeans', price: 970, description: 'Classic jeans', category: categories[1]._id, subcategory: subCategories[4]._id, image: 'jeansMen.jpeg'},
        {title: 'Sport top', price: 770, description: 'Classic top', category: categories[1]._id, subcategory: subCategories[5]._id, image: 'topMen.jpeg'},
        {title: 'Basic for kids', price: 770, description: 'Pajamas', category: categories[2]._id, subcategory: subCategories[6]._id, image: 'basicKids.jpeg'},
        {title: 'Basic top', price: 770, description: 'Classic top', category: categories[2]._id, subcategory: subCategories[7]._id, image: 'topKids.jpeg'},
        {title: 'Basic joggers', price: 770, description: 'Classic joggers', category: categories[2]._id, subcategory: subCategories[8]._id, image: 'bottomKids.jpeg'}
        );

    await connection.close();
};


run().catch(error => {
    console.log('Something went wrong', error);
});
