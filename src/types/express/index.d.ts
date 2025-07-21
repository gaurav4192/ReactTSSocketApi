import  Express  from "express";


declare global{
    namespace Express{
            interface Request{
                   user?: { id:any};
                //user?: Record<string,any>;
            }
    }
}

export {}