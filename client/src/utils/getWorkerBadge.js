export const getWorkerBadge = (worker) => {

 if(

  worker?.averageRating === 5 &&

  worker?.totalRatings >= 100

 ){

  return {

   name:"SETURYX",

   slogan:"श्रमेव जयते",

   image:"/seturyx-badge.png"

  };

 }

 return null;

};