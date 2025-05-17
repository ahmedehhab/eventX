class ApiFeatures {
    constructor(MongooseQuery, queryStr) {
        this.MongooseQuery=MongooseQuery;
        this.queryStr = queryStr;
    }

    paginate(){
        const page = Number(this.queryStr.page) || 1;
        const limit = Number(this.queryStr.limit) || 10;
        const skip = (page - 1) * limit;
        this.MongooseQuery = this.MongooseQuery.skip(skip).limit(limit);
        return this;
    }
    

    limitFields(){
      if(this.queryStr.fields){
        const fields= this.queryStr.fields.split(',').join(' ');

        this.MongooseQuery=this.MongooseQuery.select(fields);
      }else{
        this.MongooseQuery=this.MongooseQuery.select(['-__v', '-password']);

      }
      return this;
    }

    filter(fields = []) {
        const filterOption = {};
        const validOps = [
          'gt', 'gte', 'lt', 'lte', 'ne',
          'in', 'nin', 'eq', 'exists',
          'regex', 'size', 'all', 'elemMatch'
        ];
      
        // Helper to convert string values to proper JS types
        const parseValue = val => {
          if (val === 'true') return true;
          if (val === 'false') return false;
          if (!isNaN(val)) return Number(val);
          if (typeof val === 'string' && val.includes(',')) return val.split(',').map(v => parseValue(v));
          return val;
        };
      
        for (let key in this.queryStr) {
          if (!fields.includes(key)) continue;
      
          const value = this.queryStr[key];
      
          // Handle multiple values like ?name=ahmed&name=ali
          if (Array.isArray(value)) {
            filterOption[key] = { $in: value.map(parseValue) };
            continue;
          }
      
          // Handle direct values like ?role=admin
          if (typeof value !== 'object') {
            filterOption[key] = parseValue(value);
            continue;
          }
      
          // Handle operators like ?price[gte]=50 or ?name[in]=ahmed,ali
          for (let operator in value) {
            if (validOps.includes(operator)) {
              if (!filterOption[key]) filterOption[key] = {};
              filterOption[key][`$${operator}`] = parseValue(value[operator]);
            }
          }
        }
        if (Object.keys(filterOption).length > 0) {
          this.MongooseQuery = this.MongooseQuery.find(filterOption);
        }
      
        return this;
      }

      
    sort(){
        if(this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.MongooseQuery = this.MongooseQuery.sort(sortBy);
          }else{
            this.MongooseQuery = this.MongooseQuery.sort('-createdAt');
          }
          return this;
    }

    search(fields){
        if(this.queryStr.search){
            const newRegex= new RegExp(this.queryStr.search,'i');

            const searchQuery={
                $or: fields.map(field=>{
                    return {[field]: newRegex}
                })
            }

            this.MongooseQuery=this.MongooseQuery.find(searchQuery);
        }

        return this;
    }


}

export default ApiFeatures;