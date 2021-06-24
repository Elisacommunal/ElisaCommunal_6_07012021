const Thing = require('../models/Thing');
const fs = require('fs');


exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  console.log(req.body.sauce);
  delete thingObject._id;
  const thing = new Thing({
    ...thingObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.modifySauce = (req, res, next) => {
    const thingObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }: { ...req.body };

      //delete old image if changing image
    if(req.file !== undefined){
      Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          console.log("L'image d'origine a bien été supprimée");
        })})
      .catch(error => res.status(500).json({ error }));
    };

    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauce = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      const filename = thing.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Thing.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce =  (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
    Thing.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };

  exports.likeOrDislikeSauce = async(req, res, next)=>{
    
    const userId = req.body.userId;
    const likes = req.body.like;
    const id = req.params.id;
    const sauce = await Thing.findOne({ _id: req.params.id });
    
    switch (likes) {
      case 1: // on like
        
          if (!sauce.usersLiked.includes(userId)) {//Si User n'a pas deja liké cette sauce (pas présent dans tableau usersLiked)
            await Thing.findByIdAndUpdate(id, { $inc: {likes: 1}, $push: {usersLiked: userId}}) // ajoute un like et push user dans tableau usersLiked
            .then(() => res.status(201).json({ message: 'vous avez aimé cette sauce !'}))
            .catch(error => res.status(400).json({ error }));    
        
        }  
      break;

      case 0: // on retire son like/dislike
        
                  
          if (sauce.usersLiked.includes(userId)){ //Si User a deja liké cette sauce (présent dans tableau usersLiked)
            await Thing.findByIdAndUpdate(id, { $inc: {likes: -1}, $pull: {usersLiked: userId}}) // retire le like et sort user du tableau usersLiked
            .then(() => res.status(201).json({ message: 'Like retiré !'}))
            .catch(error => res.status(400).json({ error }));  
            break;

          } else if (sauce.usersDisliked.includes(userId)){ //Si User a deja disliké cette sauce (présent dans tableau usersDisliked)
            await Thing.findByIdAndUpdate(id, { $inc: {dislikes: -1}, $pull: {usersDisliked: userId}}) // retire le dislike et sort user du tableau usersDisliked
            .then(() => res.status(201).json({ message: 'Dislike retiré !'}))
            .catch(error => res.status(400).json({ error }));  
          }
          
                 
        break;

      case -1: // on dislike

          
          if (!sauce.usersDisliked.includes(userId)){ //Si User n'a pas deja disliké cette sauce (pas présent dans tableau usersdisliked)
           await Thing.findByIdAndUpdate(id, { $inc: {dislikes: 1}, $push: {usersDisliked: userId}}) // ajoute un dislike et push user dans tableau usersDisliked
           .then(() => res.status(201).json({ message: "Vous n'avez pas aimé cette sauce !"}))
           .catch(error => res.status(400).json({ error }));  
          }
          
          
        break;

      default: break;
    }
  
  
};
