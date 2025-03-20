import {Router} from 'express'
import { categorizeProducts } from '../categorie' 

const routes = Router()

routes.post('/categorize', (req, res) =>{
    const products = req.body
    const categorized = categorizeProducts(products)
    res.json(categorized)
})

export default routes