const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect('mongodb+srv://test:sparta@cluster0.pkemp.mongodb.net/node2week?retryWrites=true&w=majority').catch((err) => {
        console.error(err);
    })
};

const db = mongoose.connection;

const handleConnection = () => {
    console.log('DB가 연결되었습니다. 오늘도 정신차려 집중집중!');
  };

db.once('open', handleConnection);

module.exports = connect;