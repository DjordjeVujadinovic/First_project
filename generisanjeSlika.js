const generateForm= document.querySelector(".generate-form");
const imageGallery= document.querySelector(".image-gallery");
const OPENAI_API_KEY ="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";
let isImageGenerating= false;
const updateImageCard=(imgDataArray)=>{
    imgDataArray.forEach((imgObject, index) => {
        const imgCard= imageGallery.querySelectorAll(".img-card")[index];
        const imgElement= imgCard.querySelector("img");
        const downloadBtn= imgCard.querySelector(".download-btn");
        const aiGeneratedImg= `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src= aiGeneratedImg;
        imgElement.onload= ()=>{
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages= async(userPrompt,userImgQuantity)=>{
    try{
        const response= await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}` ,
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parent(userImgQuantity),
                size: "512x512",
                response_format : "b64_json"
            }),
        });
        if(!response.ok) throw new Error("Nije uspelo da se generisu slike jebega");
        const{data}= await response.json();
        updateImageCard([... data]);
    }catch(error){
        alert(error.message);
    }finally{
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating= false;
    }
}
const handleFormSubmission=(e)=>{
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating= true;
    const userPrompt= e.srcElement[0].value;
    const userImgQuantity= e.srcElement[1].value;
    isImageGenerating = true;
    const imgCardMarkup= Array.from({length: userImgQuantity}, () =>
        `<div class="img-card loading">
        <img src="C:/Users/Djolence/Downloads/images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="C:/Users/Djolence/Downloads/images/download.svg" alt="download icon">
        </a>
    </div>`
    ).join("");
    imageGallery.innerHTML =imgCardMarkup;
    generateAiImages(userPrompt,userImgQuantity);
}
generateForm.addEventListener("submit", handleFormSubmission);