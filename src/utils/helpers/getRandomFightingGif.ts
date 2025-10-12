const gifs = [
  "https://c.tenor.com/oLvqOD4_sPUAAAAd/tenor.gif",
  "https://c.tenor.com/ifwnXMvqE0sAAAAC/tenor.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHQyMXRncDhtc2hwdGpidGpqcXB2MzByM200NGc1bWg0eDZwNWRkZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ABgNxvbk95V3W/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmE0NmkxYjRxYWFubW55ODJ1MGQ1YmViYTJ4aWUzeXd2OGd2M2JxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/63MO9LTRoTXQk/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHBoYzE0aDZkN2xxNWhzcHBmNnR4NXd4c3V0OTNpdzJ5aW1jc2ZlNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/XeNrmVGsK2sHIjUosG/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDV1aGtwbno0NGJ0Z25tNTlueXIzdGhvMHhqZ3J2enE1cXJ0c3RtMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI1erPMTMBFmNHi/giphy.gif",
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2xvcnZ3YWJ1eHI0bTNnZmxieG90aW1tendlMzI1ZGxzcHdkcjJvcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/EBDuUkEh5ctI7augD8/giphy.gif",
];

export const getRandomFightGif = async () => {
  return gifs[Math.floor(Math.random() * gifs.length)];
};
