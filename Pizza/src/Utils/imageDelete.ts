import * as AWS from 'aws-sdk';

const imageDelete = async (imgUrl : string) => {
    AWS.config.update({region : "us-east-2"});
    var s3 = new AWS.S3({apiVersion : '2006-03-01'});
    
    const imgId : string = imgUrl.split('/').pop();

    const params = {
        Bucket : process.env.BUCKET_NAME,
        Key : imgId
    }

    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);
    });
}

export default imageDelete;