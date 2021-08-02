import Joi from 'joi';

const validateWithJoi = (reqData,reqType)=>{
    let schema;
    switch (reqType) {
      case 'createActivity':
        schema={
            activityName:Joi.string().min(2).required(),
            description:Joi.string(),
            address:Joi.string().min(2).required(),
            city:Joi.number().required(),
            coords:Joi.array(),
            picture:Joi.array(),
            subCategory:Joi.number().required(),
            duration:Joi.number().required(),
            time:Joi.string(),
            age:Joi.number(),
        }
        break;
      case 'updateActivity':
        schema={
            activityName:Joi.string().min(2).required(),
            description:Joi.string(),
            address:Joi.string().min(2).required(),
            city:Joi.number().required(),
            coords:Joi.array(),
            picture:Joi.array(),
            subCategory:Joi.number().required(),
            duration:Joi.number().required(),
            time:Joi.string(),
            age:Joi.number(),
        }
        break;
        case 'createCategory':
            schema={
                category: Joi.string().min(2).required(),
            }
        break;
        case 'updateCategory':
            schema={
                category: Joi.string().min(2).required(),
            }
        break;
        case 'createCity':
            schema={
                cityName: Joi.string().min(2).required(),
                regionId: Joi.number().required()
            }
        break;
        case 'updateCity':
            schema={
                cityName: Joi.string().min(2).required(),
                regionId: Joi.number().required()
            }
        break;
        case 'createDuration':
            schema={
                durationText: Joi.string().min(2).required(),
            }
        break;
        case 'updateDuration':
            schema={
                durationText: Joi.string().min(2).required(),
            }
        break;
        case 'createRegion':
            schema={
              regionName: Joi.string().min(2).required(),
            }
            break;
        case 'updateRegion':
            schema={
                regionName: Joi.string().min(2).required(),
            }
        break;
        case 'createSubCategory':
            schema={
                subCategoryName: Joi.string().min(2).required(),
                catId: Joi.number().required()
            }
        break;
        case 'updateSubCategory':
            schema={
                subCategoryName: Joi.string().min(2).required(),
                catId: Joi.number().required()
            }
        break;
      default:
        break;
    };
    return Joi.object(schema).validate(reqData)
  };
export default validateWithJoi