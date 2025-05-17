const getKeysModel=(model,ignore=[])=>{
    const keys=Object.keys(model.schema.paths);
    return keys.filter(key=>!ignore.includes(key));
}

export default getKeysModel;