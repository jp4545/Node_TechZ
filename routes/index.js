const express = require('express');
const router = express.Router();
const myParser = require('body-parser');
const port = 8000;
const https = require('https');

var paytmParams = {};

/* GET home page. */
router.get('/', function(req, res) {
  res.render('signup.ejs');
});

// router.get('/logout',(req, res, next)=>{
//   req.logout();
//   req.flash('success_msg', 'You are successfully logged out');
//   res.redirect('/');
// });

router.get('/logout', function(req,res){
  req.flash('success_msg', 'You are successfully logged out');
  res.render('logout.ejs', {name :req.user.id});
});


//Payment
router.get('/payments', function(req,res){
  let params = {
    "MID" : 'pnnGCE37370424584397',
    "WEBSITE" : 'WEBSTAGING',
    "CHANNEL_ID" : 'WEB',
    "INDUSTRY_TYPE_ID" : 'Retail',
    "ORDER_ID" : 'ORD0003',
    "CUST_ID" : 'CUST0013',
    "CALLBACK_URL" : 'http://localhost:'+port+'/success',
    "TXN_AMOUNT" : '100',
    "EMAIL" : 'prakashj1998@gmail.com',
    "MOBILE_NO" : '8973325865'
  };

  checksum_lib.genchecksum(params,'qldj8aAIMknER1tJ',function(err,checksum){
    var url = "https://securegw-stage.paytm.in/order/process";
    res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html>');
		res.write('<head>');
		res.write('<title>Merchant Checkout Page</title>');
		res.write('</head>');
		res.write('<body>');
		res.write('<center><h1>Please do not refresh this page...</h1></center>');
		res.write('<form method="post" action="' + url + '" name="paytm_form">');
		for(var x in params){
			res.write('<input type="hidden" name="' + x + '" value="' + params[x] + '">');
		}
		res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
		res.write('</form>');
		res.write('<script type="text/javascript">');
		res.write('document.paytm_form.submit();');
		res.write('</script>');
		res.write('</body>');
		res.write('</html>');
    res.end();
    
  });
});
router.post('/success',function(req,res){
  var paytmParams = {};
  paytmParams["MID"] = 'pnnGCE37370424584397';
  paytmParams["ORDERID"] = 'ORD0003';
checksum_lib.genchecksum(paytmParams, 'qldj8aAIMknER1tJ', function(err, checksum){
    paytmParams["CHECKSUMHASH"] = checksum;
    var post_data = JSON.stringify(paytmParams);

    var options = {
        hostname: 'securegw-stage.paytm.in',
        port: 443,
        path: '/order/status',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    // Set up the request
    var response = "";
    var post_req = https.request(options, function(post_res) {
        post_res.on('data', function (chunk) {
            response += chunk;
        });

        post_res.on('end', function(){
            console.log('Response: ', response);
        });
    });

    // post the data
    post_req.write(post_data);
    post_req.end();
    res.redirect('/');
})
});

// Projects
router.get('/imageProcessing',function(req,res){
  res.render('projectSingle.ejs',{title:'Image Processing',para1: 'Image processing is a method to convert an image into digital form and perform some operations on it, in order to get an enhanced image or to extract some useful information from it. It is a type of signal dispensation in which input is an image, like video frame or photograph and output may be image or characteristics associated with that image. This course will provide you an intensive and innovative classroom learning session of image and video processing. Our learning module will help you to obtain knowledge in real time industrial practices to describe and analyse images and videos as two- and three-dimensional signals in the spatial, spatial-temporal, and frequency domains.',para2:'In this class not only will you learn the theory behind fundamental processing tasks including image/video enhancement, recovery, and compression - but you will also learn how to perform these key processing tasks in practice using state-of-the-art techniques and tools. We will introduce and use a wide variety of Python Flavoured tools – from optimization toolboxes to statistical techniques.',para3:'In all cases, example images and videos pertaining to specific application domains will be utilized.',quotes:'Have a Happy Learning !!'});
});
router.get('/deeplearning', function(req,res){
  res.render('projectSingle.ejs', {title: 'Deep Learning',para1:'Knowing the Benchmarks of the Deep Learning and If you have made your mind to explore on Mastering Machine’s world.',para2:'Yes, you have landed the right foot. Learning in an innovative way to understand the hierarchy of neural networks with the guidance of experienced industrial experts will help you to master the machines. You would also be preloaded with most powerful deep learning algorithms trained in both R and Python. On-hands practicing session would enhance you to understand the workflow of neural networks where you and your machines learn deeply from experience.',para3:'Deep learning methods aim at learning feature hierarchies with features from higher levels of the hierarchy formed by the composition of lower level features. Automatically learning features at multiple levels of abstraction allow a system to learn complex functions mapping the input to the output directly from data, without depending completely on human-crafted features. Deep learning algorithms seek to exploit the unknown structure in the input data in order to discover complex patterns, often at multiple levels, with higher-level learned features defined in terms of lower-level features',quotes:'More deep you dig in Knowledge <br>More power to you !!'});
});
router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}
module.exports = router;
