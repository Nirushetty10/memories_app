let memID = [];
const formElement = document.querySelector("form");
const inputElements = document.querySelectorAll("input");
const errorEle = document.getElementById("msgError");
const divEle = document.querySelector(".container");
const createButton = document.getElementById("create-btn");
const displayDiv = document.querySelector(".display-container");
const cardContainer = document.querySelector(".card-container");

formElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title-input").value;
  const desc = document.getElementById("desc-input").value;
  const image = document.getElementById("image-input").files[0];
  const date = document.getElementById("date-input").value;

  try {
    if (
      title.length == 0 ||
      desc.length == 0 ||
      image.length == 0 ||
      date.length == 0
    ) {
      throw new TypeError("*all fields are reqiured");
    }
  } catch (error) {
    errorEle.textContent = error.message;
    return;
  }
  try {
    if (desc.length > 250) {
      throw new TypeError("*description text count exceeded");
    }
  } catch (error) {
    errorEle.textContent = error.message;
  }

  if (image) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = reader.result;
      apicallingFunction({ title, desc, arrayBuffer, date });
    };
    reader.readAsArrayBuffer(image);
  }
});

async function apicallingFunction(data) {
  try {
    const result = await fetch(`http://localhost:3001/auth/userid`);
    let id = await result.json();
    console.log(id);
    let response = await fetch(
      `http://localhost:3001/memories/addMemories/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          memory_title: data.title,
          memory_desc: data.desc,
          memory_img: Array.from(new Uint8Array(data.arrayBuffer)),
          memory_date: data.date,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (response.ok) {
      Swal.fire("created", "You have created memory successfully", "success");
      divEle.classList.add("contianer-visible");
      window.location.reload();
    } else {
      const errorResponse = await response.text();
      errorEle.textContent = errorResponse;
    }
  } catch (err) {
    console.log(err);
  }
}

function removeForm() {
  divEle.classList.remove("contianer-visible");
  createButton.style.backgroundColor = "#ffff";
  createButton.style.color = "black";
  displayDiv.style.display = "grid";
}

async function reDirectPage(){
  try {
    let response = await fetch(`http://localhost:3001/auth/logout`);
    if (response.ok) {
      window.location.href = "http://localhost:3001";
    }
  } catch (error) {
    console.log(error);
  }
}

createButton.addEventListener("click", (e) => {
  divEle.classList.add("contianer-visible");
  e.target.style.backgroundColor = "rgb(255, 179, 80)";
  e.target.style.color = "#ffff";
  displayDiv.style.display = "none";
});

inputElements.forEach((input) => {
  input.addEventListener("focus", () => {
    errorEle.textContent = "";
  });
});

window.onload = async () => {
  try {
    const result = await fetch(`http://localhost:3001/auth/userid`);
    let id = await result.json();
    let response = await fetch(`http://localhost:3001/memories/memory/${id}`);
    if (response.ok) {
      let responseResult = await response.json();
      responseResult.forEach(async (res, resIndex) => {
        memID.push(res._id);
        const byteArray = new Uint8Array(res.memory_img.data);
        const blob = new Blob([byteArray], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        const clonedDiv = cardContainer.cloneNode(true);
        clonedDiv.classList.remove("card-display");
        clonedDiv.querySelector("#imageEle").src = imageUrl;
        clonedDiv.querySelector("#headEle").textContent = `${res.memory_title}`;
        clonedDiv.querySelector("#descEle").textContent = `${res.memory_desc}`;
        clonedDiv.querySelector("#dateEle").textContent = `${res.memory_date}`;
        clonedDiv.querySelector(".hidden-heart").classList.add("display-icon-hidden");
        clonedDiv.querySelector(".filled-heart").classList.add("display-icon-filled");
        displayDiv.appendChild(clonedDiv);

        let likeStatusResponse = await fetch(
          `http://localhost:3001/memories/memory/like/${id}/${resIndex}`
        );
        const responseResul = await likeStatusResponse.json();
        console.log(responseResul);
        if (responseResul) {
          clonedDiv.querySelector(".empty-heart").classList.add("hidden-heart");
          clonedDiv.querySelector(".filled-heart").classList.remove("hidden-heart");
        } else {
          clonedDiv.querySelector(".filled-heart").classList.add("hidden-heart");
          clonedDiv.querySelector(".empty-heart").classList.remove("hidden-heart");
        }
        let hIcon = document.getElementsByClassName("display-icon-hidden");
        let fIcon = document.getElementsByClassName("display-icon-filled");
      Array.from(hIcon).forEach((ele, index) => {
        ele.addEventListener("click", () => {
          console.log(index);
            updateLike(id,memID[index])
        })
      })
      Array.from(fIcon).forEach((ele, index) => {
        ele.addEventListener("click", () => {
          console.log(index);
            updateLike(id,memID[index])
        })
      })
      });
      let deleteBtn = document.querySelectorAll(".fa-trash");
      deleteBtn.forEach((btn, index) => {
        btn.addEventListener("click", async () => {
          let response = await fetch(
            `http://localhost:3001/memories/memory/${id}/${memID[index]}`,
            {
              method: "PUT",
            }
          );
          window.location.reload();
        });
      });
    } else {
      const errorResponse = await response.text();
      console.log(errorResponse);
    }
  } catch (err) {
    console.log(err);
  }
};
async function updateLike(id,second) {
  try {
    let response = await fetch(`http://localhost:3001/memories/memory/like/${id}/${second}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (response.ok) {
      window.location.reload();
    } else {
      const errorResponse = await response.text();
      console.log(errorResponse);
      errorEle.textContent = errorResponse;
    }
  } catch (err) {
    console.log(err);
  }
}
