class APiFeatures {
    constructor(mongooseQuery , queryString ){
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

Filter() {
    const queryStringObj ={...this.queryString};
    const excludesFields = ['page', 'sort' , 'limit'  , 'fields' , 'keyword'];
    excludesFields.forEach((field)=> delete queryStringObj[field])

    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g  , match => `$${match}`)

    let filterObj = JSON.parse(queryStr); // رجع هذا السطر

    // نحول أي قيمة رقمية لـ Number
    Object.keys(filterObj).forEach(key => {
        if (typeof filterObj[key] === 'object') {
            Object.keys(filterObj[key]).forEach(op => {
                filterObj[key][op] = Number(filterObj[key][op]);
            });
        }
    });

    this.mongooseQuery = this.mongooseQuery.find(filterObj)

    return this;
}

sort() {    
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.mongooseQuery = this.mongooseQuery.sort(sortBy)
    }else{
        this.mongooseQuery = this.mongooseQuery.sort('-createdAt')
    }
    return this;
}

limitFields() {
    if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.mongooseQuery = this.mongooseQuery.select(fields)
    } else{
        this.mongooseQuery = this.mongooseQuery.select('-__v')
    }
    return this;
}

    // ابحث عن الكليه في في الحقول الي انا هوضحها 
    // في المثال هنا بيبحث في ال تايتيل وال ديسكريبشن 
search(modelName) {
    if (this.queryString.keyword) {
        
        let query = {}

        if (modelName === 'product') {
            query.$or = [                                 // men === MEN
                { title: { $regex: this.queryString.keyword, $options: 'i' } },
                { description: { $regex: this.queryString.keyword, $options: 'i' } }
            ]
        } else {
            query.$or = [
                { name: { $regex: this.queryString.keyword, $options: 'i' } }
            ]
        }
        this.mongooseQuery = this.mongooseQuery.find(query)
    }

    return this
}

paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1|| 10;
    const skip = (page - 1 ) * limit;
    const endIndex = page * limit;


    // pagenation Result
    const pagenation = {};
    pagenation.currentPage = page;
    pagenation.limit = limit;
    pagenation.numberOfPage = Math.ceil( countDocuments / limit);

    // next Page
    if(endIndex < countDocuments){
        pagenation.next = page + 1;
    }
    if(skip > 0){
        pagenation.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
    this.pagenationResult = pagenation;
    return this;
}}

module.exports = APiFeatures;