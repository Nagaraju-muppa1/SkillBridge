const requests = require("../model/request");

const requestSlot = async(req,res)=>{
    try{
        const {learnerId,learnerName,profName,professionalId,date,startTime,endTime,status,description} = req.body;
        console.log(req.body)
        const data = new requests({
            learnerId,
            learnerName,
            profName,
            professionalId,
            date,
            startTime,
            endTime,
            status,
            description
        })
        const savedRequest = await data.save();
        console.log(savedRequest);
        res.status(200).json({
            success:true,
            message:"Slot request successfully sent"
        })

    }catch(error){
        console.log(error);
        res.status(404).json({
            message:"Error while requesting slot"
        })
    }
}

const updateStatus = async(req,res)=>{
    try{
        const { status } = req.body;
        console.log(req.params.id);
        const updatedRequest = await requests.findByIdAndUpdate(
        req.params.id,
        { Status: status },
        { new: true }
        );

        res.json({
        success: true,
        data: updatedRequest
        });
      
    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:"false",
            message:"UnSuccessfully while Updating Status."
        })
    }
}
const fetchRequests = async(req,res)=>{
    try{
        const professionalId = req.params.UserId;
        console.log(professionalId);
        const data = await requests.find({professionalId:professionalId});
        if(data == null){
            return res.status(200).json({
                success:false,
                message:"UnSuccessfull"
            })
        }
        console.log(data);
        return res.status(200).json({
            success:"true",
            data: data
        })

    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Fethching requests unsuccessful"
        })
    }
}



module.exports = {requestSlot,fetchRequests,updateStatus};



// slot
// : 
// {_id: '69777421509d614396af3955', 
// UserId: 'PF00002', 
// day: 'Tue', 
// startTime: '12:00', 
// endTime: '01:00', …}