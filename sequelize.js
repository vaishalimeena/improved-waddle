const config = require('config');
const db = config.get('db');

const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const UserQuizModel = require('./models/user_quiz');
const UserAnswerModel = require('./models/user_answer');
const QuizModel = require('./models/quiz');
const CategoryModel = require('./models/category');
const QuestionModel = require('./models/question');
let sequelize;

if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres'
  });
} else {
  sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: db
  });
}

const User = UserModel(sequelize, Sequelize);
const UserQuiz = UserQuizModel(sequelize, Sequelize);
const UserAnswer = UserAnswerModel(sequelize, Sequelize);
const Quiz = QuizModel(sequelize, Sequelize);
const Category = CategoryModel(sequelize, Sequelize);
const Question = QuestionModel(sequelize, Sequelize);

User.hasMany(UserQuiz);
Quiz.hasMany(UserQuiz);
Quiz.hasMany(Question, {onDelete: 'cascade'});
Category.hasMany(Quiz);
UserQuiz.hasMany(UserAnswer, {onDelete: 'cascade'});
Question.hasMany(UserAnswer);

sequelize.sync().then(() => {
  console.log("Database and tables created");
});

module.exports = {
  User,
  UserQuiz,
  UserAnswer,
  Quiz,
  Category,
  Question,
  sequelize
};
