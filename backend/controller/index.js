const prisma = require('../prisma/index.js')



const  getNoteAll = async (req, res) => {
  const data = await prisma.note.findMany()
  console.log("getnoteall...");
  res.json({
    "status":200,
    data
  })
  }
const  postNote = async (req, res) => {
  const data = req.body
  await prisma.note.create({
            data: data,
          })
  res.json({
    "status":200
  })
}
const  getNote = async (req, res) => {
  try {
  const id = req.params.id
  const data = await prisma.note.findMany({
    where: {
      nomor:parseInt(id)
    },
  })
  res.json({
    "status":200,
    data
  })
  } catch (error) {
    console.log(error);
  }

}
const  deleteNote = async (req, res) => {
  const id = req.params.id
  const find = await prisma.note.findMany({
    where: {
      id:parseInt(id)
    }
  })
  if (find.length > 0) {
    const deleteNote = await prisma.note.delete({
      where: {
        id:parseInt(id),
      },
    })
    res.json({
      "status":200,
      data:deleteNote
    })
  }else{
    res.json({
      "status":404,
      data:find
    })
  }
}
const  updateNote = async (req, res) => {
  console.log(req.body);
  const data =req.body
  const id = req.params.id
  const find = await prisma.note.findMany({
    where: {
      id:parseInt(id)
    },
  })
  if (find.length > 0 ) {
    const updateNote = await prisma.note.update({
      where: {
        id:parseInt(id)
      },
      data: data,
    })
    res.json({
      "status":200,
      data:updateNote
    })
  }else{
    res.json({
      "status":404,
      data:find
    })
  }
  
  //const post = await prisma.note.update({
  //   where: { id: 1 },
  //   data: { isi:'data diubah' },
  // })
}

const searchNote = async (req,res)=>{
  console.log(req.query);
  console.log("search...");
  const data = await prisma.note.findMany({
    where: {
      nama: {
        contains:req.query.search,
      }
    },
  }) 
  res.json({"status":200,data})

}
const getNotePagination = async (req,res)=>{
  console.log(req.body);
  const data= await prisma.note.findMany({
    skip: parseInt(req.body.skip),
    take: parseInt(req.body.take),
    orderBy: {
      id: req.body.order,
    },
    // cursor: {
    //   id: parseInt(req.body.cursor),
    // },
  })  
  res.json({"status":200,data})
}
const getNoteScrolling = async (req,res)=>{
  console.log("scrolling",req.query);
  const take = parseInt(req.query.take)
  const lastNote = parseInt(req.query.lastNote)
  const search = req.query.search
  console.log(search);
  let data = []
  if (lastNote<1) {
      const result= await prisma.note.findMany({
      skip: 0,
      take: take,
      orderBy: {
        nomor:'asc',
      },
      where: {
        nama: {
          contains: search,
        },
      },
      })
      data = result
      console.log("awal");
  }else{
      const result = await prisma.note.findMany({
      skip: take*lastNote,
      take: take,
      // cursor: {
      //   id :,
      // },
      orderBy: {
      nomor:'asc',
      },
      where: {
        nama: {
          contains: search,
        },
      }
      })
      data = result
      console.log("scroll");
  }
  
  res.json({"status":200,data,lastNote,"next":data.length < 10 ? false:true})
}
const uploadHandler=async (req, res) => {
  console.log(req.file);
  const file = req.file.path;
  if (!file) {
    res.status(400).send({
      status: false,
      data: "No File is selected.",
    });
  }
  res.send(file);
}

module.exports = {getNoteAll,postNote,getNote,deleteNote,updateNote,getNotePagination,searchNote,getNoteScrolling,uploadHandler}