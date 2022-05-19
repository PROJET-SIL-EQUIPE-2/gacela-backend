const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()




const getAllTasks = async(id) =>{
    
    try{
        const tasks = await prisma.task.findMany({
            where : {
                agent_id : Number(id)
            }
        });

        if (tasks)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    tasks,
                },
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getCompletedTasks = async(id) =>{

    try{
        const tasks = await prisma.task.findMany({
            where : {
                agent_id : Number(id),
                completed : true
            }
        });

        if (tasks)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    tasks,
                },
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getUnfinishedTasks = async(id) =>{

    try{
        const tasks = await prisma.task.findMany({
            where : {
                agent_id : Number(id),
                completed : false
            }
        });

        if (tasks)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    tasks
                },
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const getTaskDetail = async(id) =>{

    try{
        const panne = await prisma.panne.findMany({
            where : {
                panne_id : Number(id),
            },
            include : {
                Vehicules : true
            }
        });

        if (panne)
        return {
            code : 200,
            data: { success: true, 
                data : {
                    panne
                }
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const fixPanne = async(id) =>{

        try{
            const task = await prisma.task.update ({
                where : {
                    task_id : Number(id)
                },
                data : {
                    completed : true,
                }
            });
        if(task) {
           
            var panne = await prisma.panne.update ({
                where : {
                    panne_id : Number(task.panne_id)
                },
                data : {
                    blocked : false,
                    treated : true
                }
            });
        }
        if (panne)
        return {
            code : 200,
            data: { success: true, 
                msg : "fixed succefully"
            }
        };
    }catch(e){
        console.error(e);
        return {
            code : 500,
            data: { success: false, errors: [{ msg: `Server error` }] }
        };
    }
}

const updateProgress = async(id) =>{

    try{
        
        const task = await prisma.task.findFirst({
            where : {
                task_id : Number(id),
                completed : false
            }
        });
        if(task){
                if(task.progress < 90 ) {
                    const taskUpdated = await prisma.task.update ({
                        where : {
                            task_id : Number(id)
                        },
                        data : {
                            progress : task.progress + 10,
                        }
                    });
                    return {
                        code : 200,
                        data: { success: true, 
                            msg : "updated succefully"
                        }
                    };
                }else{
                    const taskUpdated = await prisma.task.update ({
                        where : {
                            task_id : Number(id)
                        },
                        data : {
                            progress : task.progress + 10,
                            completed : true,
                        }
                    });
                    return {
                        code : 200,
                        data: { success: true, 
                            msg : "completed succefully"
                        }
                    };
                }
        }else{
            return {
                code : 200,
                data: { success: true, 
                    msg : "already completed"
                }
            };
        }
        
   
    
}catch(e){
    console.error(e);
    return {
        code : 500,
        data: { success: false, errors: [{ msg: `Server error` }] }
    };
}
}
module.exports = {
    getAllTasks,
    getCompletedTasks,
    getUnfinishedTasks,
    getTaskDetail,
    fixPanne,
    updateProgress
}