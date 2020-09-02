const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");

const seeds = [
    {
        name: "Pepega Dragon Mountain",
        image:"https://www.thoughtco.com/thmb/yD7l3EIIDRXgxisoPJ7pR1W8TmY=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-557661585-58b741123df78c060e1b45f3.jpg",        
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id metus sit amet enim finibus eleifend. Curabitur posuere lorem sed quam bibendum luctus. Vestibulum condimentum diam ut commodo consectetur. Aenean non mattis lorem. Nam ultricies elit lobortis sapien vulputate hendrerit. Donec eu lorem orci. Curabitur posuere varius felis non pulvinar. Vestibulum vestibulum dolor id massa iaculis rutrum. Morbi volutpat lobortis nibh, non tincidunt justo varius et. Cras eget elementum libero, ut interdum sapien. Aliquam semper nisi enim, id feugiat enim viverra id. Nulla eu felis pellentesque, sollicitudin lorem id, porttitor magna. Nulla sed tempor dui, eu tincidunt leo. "
    },
    {
        name: "Pepega Dragon Mountain 2",
        image:"https://www.thoughtco.com/thmb/yD7l3EIIDRXgxisoPJ7pR1W8TmY=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-557661585-58b741123df78c060e1b45f3.jpg",        
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id metus sit amet enim finibus eleifend. Curabitur posuere lorem sed quam bibendum luctus. Vestibulum condimentum diam ut commodo consectetur. Aenean non mattis lorem. Nam ultricies elit lobortis sapien vulputate hendrerit. Donec eu lorem orci. Curabitur posuere varius felis non pulvinar. Vestibulum vestibulum dolor id massa iaculis rutrum. Morbi volutpat lobortis nibh, non tincidunt justo varius et. Cras eget elementum libero, ut interdum sapien. Aliquam semper nisi enim, id feugiat enim viverra id. Nulla eu felis pellentesque, sollicitudin lorem id, porttitor magna. Nulla sed tempor dui, eu tincidunt leo. "
    },
    {
        name: "Pepega Dragon Mountain 3",
        image:"https://www.thoughtco.com/thmb/yD7l3EIIDRXgxisoPJ7pR1W8TmY=/768x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/GettyImages-557661585-58b741123df78c060e1b45f3.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id metus sit amet enim finibus eleifend. Curabitur posuere lorem sed quam bibendum luctus. Vestibulum condimentum diam ut commodo consectetur. Aenean non mattis lorem. Nam ultricies elit lobortis sapien vulputate hendrerit. Donec eu lorem orci. Curabitur posuere varius felis non pulvinar. Vestibulum vestibulum dolor id massa iaculis rutrum. Morbi volutpat lobortis nibh, non tincidunt justo varius et. Cras eget elementum libero, ut interdum sapien. Aliquam semper nisi enim, id feugiat enim viverra id. Nulla eu felis pellentesque, sollicitudin lorem id, porttitor magna. Nulla sed tempor dui, eu tincidunt leo. "
    }
]


async function seedDB(){
    await Campground.deleteMany({});
    console.log("REMOVED CAMPGROUNDS!!!");
    await Comment.deleteMany({});
    console.log("REMOVED COMMENTS!!!");

    for(const seed of seeds){
        let campground = await Campground.create(seed);
        console.log("CAMPGROUND CREATED");
        let comment = await Comment.create(
            {
                text: "This place is KomodoHype",
                author: "Chat1"
            }
        );
        console.log("COMMENT CREATED");
        campground.comments.push(comment);
        campground.save();
        console.log("COMMENT ADDED TO CAMPGROUND");
    }
}

// function seedDB(){
//     //REMOVE all campgrounds
//     Campground.deleteMany({}, function(err){
//         if(err){
//             console.log(err);
//         }
//         console.log("REMOVED CAMPGROUNDS!!!");
//         //REMOVE all comments
//         Comment.deleteMany({}, function(err){
//             if(err){
//                 console.log(err);
//             }
//             console.log("REMOVED COMMENTS!!!")
//             //ADD a few campgrounds
//             seeds.forEach(function(seed){
//                 Campground.create(seed, function(err, campground){
//                     if(err){
//                         console.log(err);
//                     }else{
//                         console.log("ADDED A CAMPGROUND");
//                         //CREATE a comment
//                         Comment.create(
//                             {
//                                 text: "This place is KomodoHype",
//                                 author: "Chat1"
//                             }, function(err, comment){
//                                 if(err){
//                                     console.log(err);
//                                 }else{
//                                     campground.comments.push(comment);
//                                     campground.save();
//                                     console.log("CREATED NEW COMMENT")
//                                 }
//                             }
//                         );
//                     }
//                 });
//             });
//         });
//     });
// }

module.exports = seedDB;