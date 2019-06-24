/**
 * @author Yuriy Matviyuk
 */
import bodyParser from "body-parser"
import connectToDb from "./db/connectToDb"
import cors from "cors";
import enforce from "express-sslify"
import express from "express"
import Models from "./db/Models"
import path from "path"
import bcrypt from "bcrypt";

const app = express();
const PORT = 3001;
const router = express.Router();

connectToDb();
router.get("/", () => {});

app.use(cors());
app.use(bodyParser.json());
app.use(router);
app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '..', 'build')));

if (process.env.NODE_ENV === 'production') {
    app.use(enforce.HTTPS({
        trustXForwardedHostHeader: true,
        trustProtoHeader: true
    }));
}

router.post("/logIn", (req, res) => {
    let userData = req.body;

    Models.User.findOne(userData, (err, userDoc) => {
        if (err) {
            return console.log('Login error ---> ', err);
        }

        return res.json(userDoc)
    });
});

router.post("/signIn", (req, res) => {
    let userData = req.body,
        email = userData.email;

    Models.User.findOne({email}, (err, userDoc) => {
        if (err) {
            console.log('Login error ---> ', err);

            return res.json({err: 'loginErr'})
        }

        if (!userDoc) {
            return res.json({err: 'wrongEmailOrPassword'});
        }

        if (bcrypt.compareSync(userData.password, userDoc.password)) {
            return res.json(userDoc)
        }
    });
});

router.post("/signUp", (req, res) => {
    let userData = req.body,
        email = userData.email;

    Models.User.findOne({email}, (err, userDoc) => {
        if (err) {
            console.log('Registration error ---> ', err);

            return res.json({err: 'registrationErr'})
        }

        if (userDoc) {
            return res.json({err: 'emailExist'});
        }

        let User = new Models.User,
            result = {};

        for (let key in userData) {
            if (!userData.hasOwnProperty(key)) {
                continue
            }

            if (key === 'password') {
                userData[key] = bcrypt.hashSync(userData[key], 10);
            }

            User[key] = userData[key];
        }

        User.save().then((data) => {
            return res.json(data)
        }).catch(({errors}) => {
            result.err = [];

            for (let err in errors) {
                if (errors.hasOwnProperty(err)) {
                    result.err.push(err)
                }
            }

            return res.json(result)
        });
    });
});

router.post("/signUp", (req, res) => {
    let userData = req.body,
        email = userData.email;

    Models.User.findOne({email}, (err, userDoc) => {
        if (err) {
            console.log('Registration error ---> ', err);

            return res.json({err: 'registrationErr'})
        }

        if (userDoc) {
            return res.json({err: 'emailExist'});
        }

        let User = new Models.User,
            result = {};

        for (let key in userData) {
            if (!userData.hasOwnProperty(key)) {
                continue
            }

            if (key === 'password') {
                userData[key] = bcrypt.hashSync(userData[key], 10);
            }

            User[key] = userData[key];
        }

        User.save().then((data) => {
            return res.json(data)
        }).catch(({errors}) => {
            result.err = [];

            for (let err in errors) {
                if (errors.hasOwnProperty(err)) {
                    result.err.push(err)
                }
            }

            return res.json(result)
        });
    });
});

router.get("/getRandomBattle", (req, res) => {
// Get the count of all users
    Models.Battle.countDocuments().exec((err, count) => {
        // Get a random entry
        const index = Math.floor(Math.random() * count);

        Models.Battle
            .findOne()
            .populate('user1.data')
            .populate('user2.data')
            .skip(index)
            .exec((err, battle) => {
                if (err) {
                    console.log('Fetching  random battle error ---> ', err);

                    return res.json({success: false})
                }

                return res.json(battle)
            }
        )
    });
});

app.listen(process.env.PORT || PORT, console.log(`LISTENING ON PORT ${PORT}`));
