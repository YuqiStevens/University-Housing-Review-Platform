import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb';
import { addHousing } from '../data/housingData.js'; 
import { getHousingById } from '../data/housingData.js'; 
import { updateHousing } from '../data/housingData.js'; 



const router = express.Router();

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/images/housing'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });


// add house
router.post('/add', upload.array('images'), async (req, res) => {
    try {
        const { address, zipCode, city, state, homeType, rentalCostMin, rentalCostMax, amenities, petPolicy, garage } = req.body;
        const images = req.files.map(file => file.filename); 

        if (!address || !city || !state) {
            res.status(400).send('Missing required fields');
            return;
        }

        const housingData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCost: {
                min: parseInt(rentalCostMin, 10),
                max: parseInt(rentalCostMax, 10)
            },
            amenities: amenities.split(',').map(item => item.trim()),
            petPolicy,
            garage: garage === 'on', 
            images
        };

        const newHousing = await addHousing(housingData);
        res.redirect('/housing/list'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// get house
router.get('/:id', async (req, res) => {
    try {
        const housingId = req.params.id;
        if (!ObjectId.isValid(housingId)) {
            res.status(400).send('Invalid housing ID');
            return;
        }

        const housing = await getHousingById(housingId);
        if (!housing) {
            res.status(404).render('error', { error: 'Housing not found' });
            return;
        }

        // Check if the user is an admin
        const isAdmin = req.session.user && req.session.user.role === 'admin';

        res.render('housing', {
            title: `Details of ${housing.address}`,
            housing: housing,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// edit house
router.post('/update/:id', upload.array('images'), async (req, res) => {
    const housingId = req.params.id;
    if (!ObjectId.isValid(housingId)) {
        return res.status(400).send('Invalid Housing ID');
    }

    const { address, zipCode, city, state, homeType, rentalCostMin, rentalCostMax, amenities, petPolicy, garage } = req.body;
    const images = req.files.map(file => file.filename); // 重新上传的图片

    // 构建更新数据对象
    const updateData = {
        address,
        zipCode,
        city,
        state,
        homeType,
        rentalCost: {
            min: parseInt(rentalCostMin, 10),
            max: parseInt(rentalCostMax, 10)
        },
        amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
        petPolicy,
        garage: garage === 'on',
        images
    };

    try {
        // 更新数据库中的房源信息
        await updateHousing(housingId, updateData);
        res.redirect(`/housing/${housingId}`); // 重定向到房源详情页
    } catch (error) {
        console.error('Failed to update housing:', error);
        res.status(500).send('Failed to update housing');
    }
});



export default router;
