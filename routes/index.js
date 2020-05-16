const express = require('express');
const router = express.Router();
const myParser = require('body-parser');
const port = 3000;
const https = require('https');

var paytmParams = {};
const {ensureAuthenticated} = require('../config/auth');
const checksum_lib = require('../paytm/checksum/checksum');
/* GET home page. */
router.get('/', function(req, res) {
    if(req.isAuthenticated())
    {
      console.log("Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      console.log(req.user.email);
      console.log("isAuthenticated");
      res.render('index.ejs', {name: req.user.email});
      res.end();
    }
    if(!req.isAuthenticated())
    {
      console.log("NotAuthenticated");
      res.render('index.ejs', {name: 'undefined'});
    }
});

router.get('/aboutus', function(req,res){
  if(req.isAuthenticated())
  {
    res.render('aboutus.ejs', {name: req.user.email});
  }
  if(!req.isAuthenticated())
  {
    res.render('aboutus.ejs', {name: 'undefined'});
  }
});

router.get('/ourpeople', function(req,res){
  if(req.isAuthenticated())
  {
    res.render('ourpeople.ejs', {name: req.user.email});
  }
  if(!req.isAuthenticated())
  {
    res.render('ourpeople.ejs', {name: 'undefined'});
  }
});

router.get('/contact', function(req,res){
  if(req.isAuthenticated())
  {
    res.render('contact.ejs', {name: req.user.email});
  }
  if(!req.isAuthenticated())
  {
    res.render('contact.ejs', {name: 'undefined'});
  }
});
router.get('/test', function(req, res){
  req.flash('success_msg', 'Hiiii Jpppp');
  res.render('test.ejs');
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

router.get('/projectsall', function(req, res){
  if(req.isAuthenticated())
  {
    res.render('projects.ejs', {name: req.user.email});
    res.end();
  }
  if(!req.isAuthenticated())
    {
      console.log("NotAuthenticated");
      res.render('projects.ejs', {name: 'undefined'});
    }
});
//Payment
router.get('/payments', function(req,res){
  let params = {
    "MID" : 'pnnGCE37370424584397',
    "WEBSITE" : 'WEBSTAGING',
    "CHANNEL_ID" : 'WEB',
    "INDUSTRY_TYPE_ID" : 'Retail',
    "ORDER_ID" : 'ORD0004',
    "CUST_ID" : 'CUST0014',
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
  if(req.isAuthenticated())
  {
    res.render('projectSingle.ejs',{name: req.user.email, title:'Image Processing',para1: 'Image processing is a method to convert an image into digital form and perform some operations on it, in order to get an enhanced image or to extract some useful information from it. It is a type of signal dispensation in which input is an image, like video frame or photograph and output may be image or characteristics associated with that image. This course will provide you an intensive and innovative classroom learning session of image and video processing. Our learning module will help you to obtain knowledge in real time industrial practices to describe and analyse images and videos as two- and three-dimensional signals in the spatial, spatial-temporal, and frequency domains.',para2:'In this class not only will you learn the theory behind fundamental processing tasks including image/video enhancement, recovery, and compression - but you will also learn how to perform these key processing tasks in practice using state-of-the-art techniques and tools. We will introduce and use a wide variety of Python Flavoured tools – from optimization toolboxes to statistical techniques.',para3:'In all cases, example images and videos pertaining to specific application domains will be utilized.',quotes:'Have a Happy Learning !!', imgurl: 'images/courses/image_processing.jpeg'});
  }
  if(!req.isAuthenticated())
  {
    res.render('projectSingle.ejs',{name: 'undefined' ,title:'Image Processing',para1: 'Image processing is a method to convert an image into digital form and perform some operations on it, in order to get an enhanced image or to extract some useful information from it. It is a type of signal dispensation in which input is an image, like video frame or photograph and output may be image or characteristics associated with that image. This course will provide you an intensive and innovative classroom learning session of image and video processing. Our learning module will help you to obtain knowledge in real time industrial practices to describe and analyse images and videos as two- and three-dimensional signals in the spatial, spatial-temporal, and frequency domains.',para2:'In this class not only will you learn the theory behind fundamental processing tasks including image/video enhancement, recovery, and compression - but you will also learn how to perform these key processing tasks in practice using state-of-the-art techniques and tools. We will introduce and use a wide variety of Python Flavoured tools – from optimization toolboxes to statistical techniques.',para3:'In all cases, example images and videos pertaining to specific application domains will be utilized.',quotes:'Have a Happy Learning !!', imgurl: 'images/courses/image_processing.jpeg'});

  }
  });
router.get('/deeplearning', function(req,res){
  if(req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: req.user.email, title: 'Deep Learning',para1:'Knowing the Benchmarks of the Deep Learning and If you have made your mind to explore on Mastering Machine’s world.',para2:'Yes, you have landed the right foot. Learning in an innovative way to understand the hierarchy of neural networks with the guidance of experienced industrial experts will help you to master the machines. You would also be preloaded with most powerful deep learning algorithms trained in both R and Python. On-hands practicing session would enhance you to understand the workflow of neural networks where you and your machines learn deeply from experience.',para3:'Deep learning methods aim at learning feature hierarchies with features from higher levels of the hierarchy formed by the composition of lower level features. Automatically learning features at multiple levels of abstraction allow a system to learn complex functions mapping the input to the output directly from data, without depending completely on human-crafted features. Deep learning algorithms seek to exploit the unknown structure in the input data in order to discover complex patterns, often at multiple levels, with higher-level learned features defined in terms of lower-level features',quotes:'More deep you dig in Knowledge <br>More power to you !!', imgurl: 'images/courses/deeplearning.jpg'});
  }
  if(!req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Deep Learning',para1:'Knowing the Benchmarks of the Deep Learning and If you have made your mind to explore on Mastering Machine’s world.',para2:'Yes, you have landed the right foot. Learning in an innovative way to understand the hierarchy of neural networks with the guidance of experienced industrial experts will help you to master the machines. You would also be preloaded with most powerful deep learning algorithms trained in both R and Python. On-hands practicing session would enhance you to understand the workflow of neural networks where you and your machines learn deeply from experience.',para3:'Deep learning methods aim at learning feature hierarchies with features from higher levels of the hierarchy formed by the composition of lower level features. Automatically learning features at multiple levels of abstraction allow a system to learn complex functions mapping the input to the output directly from data, without depending completely on human-crafted features. Deep learning algorithms seek to exploit the unknown structure in the input data in order to discover complex patterns, often at multiple levels, with higher-level learned features defined in terms of lower-level features',quotes:'More deep you dig in Knowledge <br>More power to you !!', imgurl: 'images/courses/deeplearning.jpg'});
  }
  });

router.get('/supervisedlearning', function(req, res){
  if(req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: req.user.email, title: 'Supervised Learning ',para1: 'Before you be the Masters of your Machines prominently you need to be a trained supervisor to handle your machines at bottleneck and cold-start conditions. The majority of practical machine learning uses supervised learning.', para2: 'Supervised learning statistical modelling algorithms for classification and regression problems, examining how these algorithms are related, and how models generated by them can be tuned and evaluated. A part of learning covers what to be trained and how to test efficiently your machines monitoring for all implicitly and explicitly driven knowledges from experience. The supervised in supervised learning refers to the fact that each sample within the data being used to build the system contains an associated label.', para3: 'The goal is to build a model that can accurately predict the value of the label when presented with new data.', quotes: 'If you feed your photo and the Machine says Potato Then its Right insanely !! So as the Master the Machine', imgurl: ''});
  }
  if(!req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Supervised Learning ',para1: 'Before you be the Masters of your Machines prominently you need to be a trained supervisor to handle your machines at bottleneck and cold-start conditions. The majority of practical machine learning uses supervised learning.', para2: 'Supervised learning statistical modelling algorithms for classification and regression problems, examining how these algorithms are related, and how models generated by them can be tuned and evaluated. A part of learning covers what to be trained and how to test efficiently your machines monitoring for all implicitly and explicitly driven knowledges from experience. The supervised in supervised learning refers to the fact that each sample within the data being used to build the system contains an associated label.', para3: 'The goal is to build a model that can accurately predict the value of the label when presented with new data.', quotes: 'If you feed your photo and the Machine says Potato Then its Right insanely !! So as the Master the Machine', imgurl: ''});
  }
  }); 
  router.get('/reinforcementlearning', function(req, res){
  if(req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: req.user.email, title: 'Reinforcement Learning', para1: 'Reinforcement Learning is the next big thing being a part of machine learning. Reinforcement learning is one powerful paradigm for making good decisions, and it is relevant to an enormous range of tasks, including robotics, game playing, consumer modelling and healthcare. It allows machines and software agents to automatically determine the ideal behaviour within a specific context, in order to maximize its performance.', para2: 'Enhance your skill set and boost your liability through innovative, independent learning. If you have an interest in machine learning and the desire to engage with it from a theoretical perspective. Through a combination of classic papers and more recent work, you will explore automated decision-making from a computer-science perspective.', para3:'Our classroom learning session provides a detailed way to understand Reinforcement Learning with how to manage and install software for machine, how to implement common RL algorithms and learn how to solve various reinforcement learning problems in real time with an extensive brush on all the Tools supporting efficient learning.', quotes: 'Every Trial and Error method reinforces you to have a perfect learning.', imgurl: 'images/courses/reinforcementlearning.png'});
  }
  if(!req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Reinforcement Learning', para1: 'Reinforcement Learning is the next big thing being a part of machine learning. Reinforcement learning is one powerful paradigm for making good decisions, and it is relevant to an enormous range of tasks, including robotics, game playing, consumer modelling and healthcare. It allows machines and software agents to automatically determine the ideal behaviour within a specific context, in order to maximize its performance.', para2: 'Enhance your skill set and boost your liability through innovative, independent learning. If you have an interest in machine learning and the desire to engage with it from a theoretical perspective. Through a combination of classic papers and more recent work, you will explore automated decision-making from a computer-science perspective.', para3:'Our classroom learning session provides a detailed way to understand Reinforcement Learning with how to manage and install software for machine, how to implement common RL algorithms and learn how to solve various reinforcement learning problems in real time with an extensive brush on all the Tools supporting efficient learning.', quotes: 'Every Trial and Error method reinforces you to have a perfect learning.', imgurl: 'images/courses/reinforcementlearning.png'});
  }
  }); 
router.get('/aibasics', function(req, res){
  if(req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: req.user.email, title: 'AI-Basics', para1: 'Artificial intelligence (AI) is a research field that studies how to realize the intelligent human behaviours on a computer. The ultimate goal of AI is to make a computer that can learn, plan, and solve problems autonomously. Although AI has been studied for more than half a century, we still cannot make a computer that is as intelligent as a human in all aspects. However, we do have many successful applications. In some cases, the computer equipped with AI technology can be even more intelligent than us.', para2: 'The main research topics in AI include: problem solving, reasoning, planning, natural language understanding, computer vision, automatic programming, machine learning, and so on. Of course, these topics are closely related with each other. For example, the knowledge acquired through learning can be used both for problem solving and for reasoning. In fact, the skill for problem solving itself should be acquired through learning. Also, methods for problem solving are useful both for reasoning and planning. Further, both natural language understanding and computer vision can be solved using methods developed in the field of pattern recognition.', para3: 'In this course, we will study the most fundamental knowledge for understanding AI. We will introduce some basic search algorithms for problem solving; knowledge representation and reasoning; pattern recognition; fuzzy logic; and neural networks.', quotes: 'Our intelligence is what makes us human, and AI is an extension of that quality.', imgurl: 'images/courses/ai.jpg'});
  }
  if(!req.isAuthenticated())
  {
    res.render('projectSingle.ejs', {name: 'undefined', title: 'AI-Basics', para1: 'Artificial intelligence (AI) is a research field that studies how to realize the intelligent human behaviours on a computer. The ultimate goal of AI is to make a computer that can learn, plan, and solve problems autonomously. Although AI has been studied for more than half a century, we still cannot make a computer that is as intelligent as a human in all aspects. However, we do have many successful applications. In some cases, the computer equipped with AI technology can be even more intelligent than us.', para2: 'The main research topics in AI include: problem solving, reasoning, planning, natural language understanding, computer vision, automatic programming, machine learning, and so on. Of course, these topics are closely related with each other. For example, the knowledge acquired through learning can be used both for problem solving and for reasoning. In fact, the skill for problem solving itself should be acquired through learning. Also, methods for problem solving are useful both for reasoning and planning. Further, both natural language understanding and computer vision can be solved using methods developed in the field of pattern recognition.', para3: 'In this course, we will study the most fundamental knowledge for understanding AI. We will introduce some basic search algorithms for problem solving; knowledge representation and reasoning; pattern recognition; fuzzy logic; and neural networks.', quotes: 'Our intelligence is what makes us human, and AI is an extension of that quality.', imgurl: 'images/courses/ai.jpg'});
  }
  });

router.get('/hardwareandnetworking', function(req, res){
  if(req.isAuthenticated())
    {
      res.render('projectSingle.ejs', {name: req.user.email, title: 'Hardware and Networking', para1: 'A hardware professional deals with various hardware components like chips, motherboard, computer system (CPU), modem, external hard disk, printer, keyboard etc. Computer hardware professionals look after maintenance of system while networking involves joining or connecting two or more systems for sharing data and information.', para2: 'Thus, the professionals who are involved in R&D of computer hardware and networking are called as hardware networking engineers. Besides maintaining the computer, they are liable for designing the hardware installation and manufacturing process.', para3: 'Hardware and networking professionals can find plentiful of jobs in many sectors like education, films, hospitals, banking, animation etc. as most of these sectors require computers. Use of one or many computers is inevitable today. Thus, hardware and networking come into picture. Software companies, call centres, system design companies, hardware manufacturing companies, telecom industries, BPOs, hardware repair shops etc have number of jobs available for hardware networking professionals. Since hardware and networking is in big demand today, remuneration is also quite rewarding.', quotes: '', imgurl: 'images/courses/networking.png'});
    }
    if(!req.isAuthenticated())
    {
      res.render('projectSingle.ejs', {name: 'undefined', title: 'Hardware and Networking', para1: 'A hardware professional deals with various hardware components like chips, motherboard, computer system (CPU), modem, external hard disk, printer, keyboard etc. Computer hardware professionals look after maintenance of system while networking involves joining or connecting two or more systems for sharing data and information.', para2: 'Thus, the professionals who are involved in R&D of computer hardware and networking are called as hardware networking engineers. Besides maintaining the computer, they are liable for designing the hardware installation and manufacturing process.', para3: 'Hardware and networking professionals can find plentiful of jobs in many sectors like education, films, hospitals, banking, animation etc. as most of these sectors require computers. Use of one or many computers is inevitable today. Thus, hardware and networking come into picture. Software companies, call centres, system design companies, hardware manufacturing companies, telecom industries, BPOs, hardware repair shops etc have number of jobs available for hardware networking professionals. Since hardware and networking is in big demand today, remuneration is also quite rewarding.', quotes: '', imgurl: 'images/courses/networking.png'});
    }
    }); 
router.get('/ccnatraining', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'CCNA TRAINING', para1: 'Whether you need to understand fundamental Cisco Wireless topics, such as deployment planning and system maintenance, or you are ready for more advanced topics, such as client mobility and troubleshooting, we have the courses you need to gain the knowledge and experience necessary to design, install, implement, maintain and troubleshoot a Cisco Wireless LAN network.', para2: 'This course introduces the architecture, structure, functions, components, and models of the Internet and other computer networks. The principles and structure of IP addressing and the fundamentals of Ethernet concepts, media, and operations are introduced to provide a foundation for the curriculum. By the end of the course, participants will be able to build simple LANs, perform basic configurations for routers and switches, and implement IP addressing schemes. You will be will be able to configure and troubleshoot routers and switches and resolve common issues with RIPv1, RIPng, single area and multi-area OSPF, virtual LANs, and inter-VLAN routing in both IPv4 and IPv6 networks. And to configure and troubleshoot routers and switches and resolve common issues with OSPF, EIGRP, and STP in both IPv4 and IPv6 networks.', para3: 'Cisco just announced that they are migrating to a new CCNA program. For those of you who want to get your CCNA certification before the big change, then keep going!.', quotes: 'The sooner you start the course..... The sooner you will have your CCNA certification!!!', imgurl: 'images/courses/ccna_training.png'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name : 'undefined', title: 'CCNA TRAINING', para1: 'Whether you need to understand fundamental Cisco Wireless topics, such as deployment planning and system maintenance, or you are ready for more advanced topics, such as client mobility and troubleshooting, we have the courses you need to gain the knowledge and experience necessary to design, install, implement, maintain and troubleshoot a Cisco Wireless LAN network.', para2: 'This course introduces the architecture, structure, functions, components, and models of the Internet and other computer networks. The principles and structure of IP addressing and the fundamentals of Ethernet concepts, media, and operations are introduced to provide a foundation for the curriculum. By the end of the course, participants will be able to build simple LANs, perform basic configurations for routers and switches, and implement IP addressing schemes. You will be will be able to configure and troubleshoot routers and switches and resolve common issues with RIPv1, RIPng, single area and multi-area OSPF, virtual LANs, and inter-VLAN routing in both IPv4 and IPv6 networks. And to configure and troubleshoot routers and switches and resolve common issues with OSPF, EIGRP, and STP in both IPv4 and IPv6 networks.', para3: 'Cisco just announced that they are migrating to a new CCNA program. For those of you who want to get your CCNA certification before the big change, then keep going!.', quotes: 'The sooner you start the course..... The sooner you will have your CCNA certification!!!', imgurl: 'images/courses/ccna_training.png'});
  }
});
router.get('/wirelessnetworking', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Wireless Networking', para1: 'Begin preparing for a networking career with this introduction to how networks operate.  This course introduces architectures, models, protocols, and networking elements – functions needed to support the operations and priorities of Fortune 500 companies to small innovative retailers. You’ll even get the chance to build simple local area networks (LANs) yourself.  You’ll have a working knowledge of IP addressing schemes, foundational network security, and be able to perform basic configurations for routers and switches.', para2: 'Wireless communications are pervasive in our lives. They have grown in recent years to include everything from personal communications networks to governments, hospitals and neighbourhood businesses. And there’s no end in sight to the growth of our wireless world. Our Wireless Networking program is designed to put you at the centre of this exciting world by giving you high-demand skills in radio frequency (RF), cellular, broadband and advanced data communications.', para3: 'Our networking courses help you gain the skills to implement, support, optimize and defend networks, while preparing for industry-recognized networking and wireless certifications including Cisco packet Traces.', quotes: 'Build and maintain your network with confidence.', imgurl: 'images/courses/wireless.jpg'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Wireless Networking', para1: 'Begin preparing for a networking career with this introduction to how networks operate.  This course introduces architectures, models, protocols, and networking elements – functions needed to support the operations and priorities of Fortune 500 companies to small innovative retailers. You’ll even get the chance to build simple local area networks (LANs) yourself.  You’ll have a working knowledge of IP addressing schemes, foundational network security, and be able to perform basic configurations for routers and switches.', para2: 'Wireless communications are pervasive in our lives. They have grown in recent years to include everything from personal communications networks to governments, hospitals and neighbourhood businesses. And there’s no end in sight to the growth of our wireless world. Our Wireless Networking program is designed to put you at the centre of this exciting world by giving you high-demand skills in radio frequency (RF), cellular, broadband and advanced data communications.', para3: 'Our networking courses help you gain the skills to implement, support, optimize and defend networks, while preparing for industry-recognized networking and wireless certifications including Cisco packet Traces.', quotes: 'Build and maintain your network with confidence.', imgurl: 'images/courses/wireless.jpg'});
  }
});

router.get('/humanresourcemanagement', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Human Resources Management', para1: 'Human Resource Management (HRM) is the function within an organization that focuses on the recruitment of, management of, and providing direction and guidance for the people who work in an organization. As you can imagine, all of the processes and programs that are touched by people are part of the HR kingdom. The workplace processes that interact with customers and potential employees are also components in the Human Resource (HR) world.', para2: 'The courses enhances you to provide the knowledge, necessary tools, training, administrative services, coaching, legal and management advice, and talent management oversight that the rest of the organization needs for successful operation. This course examines the role of the human resource professional as a strategic partner in managing today’s organizations.', para3: 'Key functions such as recruitment, selection, development, appraisal, retention, compensation, and labour relations are examined. Implications of legal and global environments are appraised and current issues such as diversity training, sexual harassment policies, and rising benefit costs are analysed. Best practices of employers of choice are considered. Get an introduction to the practice of Human Resources, and develop the skills you need to become an HR professional, with this course from us.', quotes: 'To win the marketplace, you must first win the workplace.', imgurl: 'images/courses/hr_management.jpg'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Human Resources Management', para1: 'Human Resource Management (HRM) is the function within an organization that focuses on the recruitment of, management of, and providing direction and guidance for the people who work in an organization. As you can imagine, all of the processes and programs that are touched by people are part of the HR kingdom. The workplace processes that interact with customers and potential employees are also components in the Human Resource (HR) world.', para2: 'The courses enhances you to provide the knowledge, necessary tools, training, administrative services, coaching, legal and management advice, and talent management oversight that the rest of the organization needs for successful operation. This course examines the role of the human resource professional as a strategic partner in managing today’s organizations.', para3: 'Key functions such as recruitment, selection, development, appraisal, retention, compensation, and labour relations are examined. Implications of legal and global environments are appraised and current issues such as diversity training, sexual harassment policies, and rising benefit costs are analysed. Best practices of employers of choice are considered. Get an introduction to the practice of Human Resources, and develop the skills you need to become an HR professional, with this course from us.', quotes: 'To win the marketplace, you must first win the workplace.', imgurl: 'images/courses/hr_management.jpg'});
  }
});

router.get('/entrepreneurshipmanagement', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Entrepreneurship Management', para1: 'The only thing worse than starting something and failing… is not starting something. Your time is limited, so don’t waste it living someone else’s life. Do– which is living with the results of other people’s thinking. Don’t let the noise of other’s opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary. It’s not about ideas. It’s about making ideas happen.', para2: 'This course introduces students to the opportunities and challenges associated with the creation and management of entrepreneurial and small organizations. This course discusses innovative and contemporary approaches in addressing areas such as: starting, acquiring a business, succeeding in business, and franchising a small business venture.', para3: 'The course also provides the foundation for small business and an overview of business concepts, including topics such as: theories of entrepreneurship, types and characteristics of entrepreneurship, the business life cycle, entrepreneurial economics, accounting and financial management, legal issues, marketing research and planning, human resource management, ethics and social responsibility, product and service research development and acquisition, and the use of technology. Our classroom session would help you to recreate your business dreams into vision.', quotes: 'Entrepreneur is someone who has a vision for something and a want to create'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Entrepreneurship Management', para1: 'The only thing worse than starting something and failing… is not starting something. Your time is limited, so don’t waste it living someone else’s life. Do– which is living with the results of other people’s thinking. Don’t let the noise of other’s opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary. It’s not about ideas. It’s about making ideas happen.', para2: 'This course introduces students to the opportunities and challenges associated with the creation and management of entrepreneurial and small organizations. This course discusses innovative and contemporary approaches in addressing areas such as: starting, acquiring a business, succeeding in business, and franchising a small business venture.', para3: 'The course also provides the foundation for small business and an overview of business concepts, including topics such as: theories of entrepreneurship, types and characteristics of entrepreneurship, the business life cycle, entrepreneurial economics, accounting and financial management, legal issues, marketing research and planning, human resource management, ethics and social responsibility, product and service research development and acquisition, and the use of technology. Our classroom session would help you to recreate your business dreams into vision.', quotes: 'Entrepreneur is someone who has a vision for something and a want to create'});
  }
});

router.get('/mobileapplication', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Mobile Application', para1: 'Mobile is becoming not only the new digital hub, but also the bridge to the physical world. That’s why mobile will affect more than just your digital operations, it will transform your entire business. The rich and interactive experiences we have come to expect on mobile apps have created new standards and expectations for all digital media including the web.', para2: 'This course provides you hands-on experience and exposure to developing mobile applications for Android devices. Starting with use cases and design discussions, this course builds strong background about Android advance topics such as Responsive design, Graphics, Animations, Security and Internationalization and so on. Introduction to mobile platforms and how to program these platforms.', para3: 'Introduction to programming in Java language for mobile platforms and teamwork. Presentation of methods for developing applications for mobile devices using their hardware and system capabilities. The result is websites are evolving to become more app-like in their rich functionality.', quotes: 'You create your own App Let Play store pay for you!..', imgurl: 'images/courses/mobile_application.jpg'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Mobile Application', para1: 'Mobile is becoming not only the new digital hub, but also the bridge to the physical world. That’s why mobile will affect more than just your digital operations, it will transform your entire business. The rich and interactive experiences we have come to expect on mobile apps have created new standards and expectations for all digital media including the web.', para2: 'This course provides you hands-on experience and exposure to developing mobile applications for Android devices. Starting with use cases and design discussions, this course builds strong background about Android advance topics such as Responsive design, Graphics, Animations, Security and Internationalization and so on. Introduction to mobile platforms and how to program these platforms.', para3: 'Introduction to programming in Java language for mobile platforms and teamwork. Presentation of methods for developing applications for mobile devices using their hardware and system capabilities. The result is websites are evolving to become more app-like in their rich functionality.', quotes: 'You create your own App Let Play store pay for you!..', imgurl: 'images/courses/mobile_application.jpg'});
  }
});

router.get('/webdevelopment', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Web Development', para1: 'Your website is the centre of your digital eco-system, like a brick and mortar location, the experience matters once a customer enters, just as much as the perception they have of you before they walk through the door.', para2: 'Introduction to Web Scripting covers website development using the two technologies required in all webpages today: HTML, which provides structure & CSS, which sets formatting & positioning. After a broad overview of HTML, we’ll learn the basics of CSS (an Advanced course in the Spring covers CSS in far more depth). We’ll conclude with Responsive Web Design: a modern method for developing websites that provides optimal viewing experiences, in terms of reading, navigation, & layout across a wide range of traditional & mobile devices.', para3: 'A successful website does three things: It attracts the right kinds of visitors. Guides them to the main services or product you offer. Collect Contact details for future ongoing relation.', quotes: '“Getting a quality website is not an expenses but rather an investment.”', imgurl: 'images/courses/web develop.jpeg'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Web Development', para1: 'Your website is the centre of your digital eco-system, like a brick and mortar location, the experience matters once a customer enters, just as much as the perception they have of you before they walk through the door.', para2: 'Introduction to Web Scripting covers website development using the two technologies required in all webpages today: HTML, which provides structure & CSS, which sets formatting & positioning. After a broad overview of HTML, we’ll learn the basics of CSS (an Advanced course in the Spring covers CSS in far more depth). We’ll conclude with Responsive Web Design: a modern method for developing websites that provides optimal viewing experiences, in terms of reading, navigation, & layout across a wide range of traditional & mobile devices.', para3: 'A successful website does three things: It attracts the right kinds of visitors. Guides them to the main services or product you offer. Collect Contact details for future ongoing relation.', quotes: '“Getting a quality website is not an expenses but rather an investment.”', imgurl: 'images/courses/web develop.jpeg'});
  }
});

router.get('/fullstackdevelopment', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Full stack development', para1: 'Our weapon of choice to teach software engineering is full stack JavaScript - the most popular and widely supported language in the world. The future of the web is dynamic and real-time JavaScript applications. As users demand ever faster and more seamless user experiences, web applications built with heavy front-end JavaScript are required to cater to those demands. This trend makes expert JavaScript knowledge a high demand skill-set.', para2: 'Full Stack Developers are developers that design complete apps and websites. These developers work on all facets of development, from frontend, to backend, to database and even debugging and testing. In short, the developer must understand the app through and through. Frontend developers are more sought after because of their expertise of not in one but multiple technologies. They can handle all aspects of development, and it can result in a more seamlessly created product.', para3: 'A master course on full stack development would enhance you to build your own apps and also websites. You can also build your own applications with the help of these Full Stack Web Development courses. This course is very useful for web development peoples. Our Full stack’s immersive curriculum will expose you to the latest in modern software development for the Internet.', quotes: '', imgurl: 'images/courses/full_stack.jpeg'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Full stack development', para1: 'Our weapon of choice to teach software engineering is full stack JavaScript - the most popular and widely supported language in the world. The future of the web is dynamic and real-time JavaScript applications. As users demand ever faster and more seamless user experiences, web applications built with heavy front-end JavaScript are required to cater to those demands. This trend makes expert JavaScript knowledge a high demand skill-set.', para2: 'Full Stack Developers are developers that design complete apps and websites. These developers work on all facets of development, from frontend, to backend, to database and even debugging and testing. In short, the developer must understand the app through and through. Frontend developers are more sought after because of their expertise of not in one but multiple technologies. They can handle all aspects of development, and it can result in a more seamlessly created product.', para3: 'A master course on full stack development would enhance you to build your own apps and also websites. You can also build your own applications with the help of these Full Stack Web Development courses. This course is very useful for web development peoples. Our Full stack’s immersive curriculum will expose you to the latest in modern software development for the Internet.', quotes: '', imgurl: 'images/courses/full_stack.jpeg'});
  }
});

router.get('/djangoandflask', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Django and Flask', para1: 'Django is an excellent framework for new web developers and efficiency-minded veterans alike. Django is the most popular and most mature Python web development framework around. It makes it easier to build better Web apps more quickly and with less code. Building web sites with Django is not just smart and efficient, but fun too! This course is for candidate who wants to learn Django from scratch and work through a fully functional Project.', para2: 'This course is apt for those who have been working on Python and intend to move the expertise to the web. Through the ORM framework candidate can achieve relatively complex functionality quite rapidly. This Python Web App Development with Django Training Course will give existing Python developers great hands-on experience building robust, commercial web applications with the Django framework.   Our effective classroom courses cover all aspects of Django development, whether you’re interested in using the framework by itself, or adding it to your full stack development practice.', para3: 'The hands-on program helps you to learn by doing. So, the lectures are followed up with challenges and quizzes to check your grasp on the concepts covered.  Django training course starts by teaching students the basics of Python, then moves on to teach students how to develop Web applications using the Django framework. Learn the fundamentals of the Flask framework and its various extensions.', quotes: '', imgurl: 'images/courses/django.png'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Django and Flask', para1: 'Django is an excellent framework for new web developers and efficiency-minded veterans alike. Django is the most popular and most mature Python web development framework around. It makes it easier to build better Web apps more quickly and with less code. Building web sites with Django is not just smart and efficient, but fun too! This course is for candidate who wants to learn Django from scratch and work through a fully functional Project.', para2: 'This course is apt for those who have been working on Python and intend to move the expertise to the web. Through the ORM framework candidate can achieve relatively complex functionality quite rapidly. This Python Web App Development with Django Training Course will give existing Python developers great hands-on experience building robust, commercial web applications with the Django framework.   Our effective classroom courses cover all aspects of Django development, whether you’re interested in using the framework by itself, or adding it to your full stack development practice.', para3: 'The hands-on program helps you to learn by doing. So, the lectures are followed up with challenges and quizzes to check your grasp on the concepts covered.  Django training course starts by teaching students the basics of Python, then moves on to teach students how to develop Web applications using the Django framework. Learn the fundamentals of the Flask framework and its various extensions.', quotes: '', imgurl: 'images/courses/django.png'});
  }
});

router.get('/spring', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Spring', para1: 'One step solution to Learn the most on-demand Java web framework, including web programming with Spring and Hibernate.  Discover how to wire together your Java objects using Spring and dependency injection. Spring is a powerful lightweight application development framework used for Java Enterprise Edition (JEE). In a way, it is a framework of frameworks because it provides support to various frameworks such as Struts, Hibernate, Tapestry, EJB, JSF etc.', para2: 'The framework in broader sense can be defined as a structure using which you can solve many technical problems. You can say that, the Spring Framework is a comprehensive tool for supporting applications using Java programming language. Spring is the most popular open source Java application Framework. Most of the existing frameworks like Struts or Hibernate take care of one layer or a part of the application development.', para3: 'However, Spring Framework combines all the industry standard framework approaches into one bundle. Spring provides Dependency Injection, Aspect Oriented Programming and support for unit testing. This gives the developer time to work on main business logic rather than worrying about non-application code. Spring makes the application development fast and increases the productivity of developers. You will learn how to set up your system for Spring development, how to use Maven, and how to work with databases using Spring and Hibernate and how to create web applications with Spring MVC.', quotes: '', imgurl: 'images/courses/spring.png'});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Spring', para1: 'One step solution to Learn the most on-demand Java web framework, including web programming with Spring and Hibernate.  Discover how to wire together your Java objects using Spring and dependency injection. Spring is a powerful lightweight application development framework used for Java Enterprise Edition (JEE). In a way, it is a framework of frameworks because it provides support to various frameworks such as Struts, Hibernate, Tapestry, EJB, JSF etc.', para2: 'The framework in broader sense can be defined as a structure using which you can solve many technical problems. You can say that, the Spring Framework is a comprehensive tool for supporting applications using Java programming language. Spring is the most popular open source Java application Framework. Most of the existing frameworks like Struts or Hibernate take care of one layer or a part of the application development.', para3: 'However, Spring Framework combines all the industry standard framework approaches into one bundle. Spring provides Dependency Injection, Aspect Oriented Programming and support for unit testing. This gives the developer time to work on main business logic rather than worrying about non-application code. Spring makes the application development fast and increases the productivity of developers. You will learn how to set up your system for Spring development, how to use Maven, and how to work with databases using Spring and Hibernate and how to create web applications with Spring MVC.', quotes: '', imgurl: 'images/courses/spring.png'});
  }
});

router.get('/angular', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{name: req.user.email, title: 'Angular', para1: 'Learn through our all-inclusive Angular-Js course with adequate practical experiences to develop the easy to manage web pages. Our trainers are skilled and have the industry experience to handle classes as per the student’s proficiency. The ideal student for this course is an existing web developer, with some JavaScript knowledge that wants to add Angular to their skill set.', para2: 'As a web developer, you’ll need to learn how to use new frameworks on a regular basis. AngularJS is a full-featured framework that is incredibly popular among developers. For single-page applications, the AngularJS framework creates rich interactive features for a real-time experience.', para3: 'You’ll be introduced to the Interactive CRM, ERP models and Model-View-Controller (MVC) programming pattern and get a chance to build your own application from scratch by the end of this course.', quotes: '', imgurl: 'images/courses/angular.png' });
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {name: 'undefined', title: 'Angular', para1: 'Learn through our all-inclusive Angular-Js course with adequate practical experiences to develop the easy to manage web pages. Our trainers are skilled and have the industry experience to handle classes as per the student’s proficiency. The ideal student for this course is an existing web developer, with some JavaScript knowledge that wants to add Angular to their skill set.', para2: 'As a web developer, you’ll need to learn how to use new frameworks on a regular basis. AngularJS is a full-featured framework that is incredibly popular among developers. For single-page applications, the AngularJS framework creates rich interactive features for a real-time experience.', para3: 'You’ll be introduced to the Interactive CRM, ERP models and Model-View-Controller (MVC) programming pattern and get a chance to build your own application from scratch by the end of this course.', quotes: '', imgurl: 'images/courses/angular.png'});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
});

router.get('', function(req, res){
  if(req.isAuthenticated()){
    res.render('projectSingle.ejs',{});
  }
  if(!req.isAuthenticated()){
    res.render('projectSingle.ejs', {});
  }
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
