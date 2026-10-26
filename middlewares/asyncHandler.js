// to handle async errors globally
module.exports = (func)=>{   
  return (req, res, next)=>{  // 
    func(req, res, next) // call the async function
        .catch(err => next(err));  // if there is an error, pass it to next() 
  }
}