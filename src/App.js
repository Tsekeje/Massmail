import "./App.css";
import { Input } from 'antd';
import { Editor } from "@tinymce/tinymce-react";
import React, { useState, useRef } from "react";
import axios from "axios";
const { TextArea } = Input;
function App() {

  //
  const [body, setBody] = useState();
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      setBody(editorRef.current.getContent());
      //  console.log(editorRef.current.getContent())
    }
  };

//
// Post
  function handleMail(e) {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    var raw = JSON.stringify({
      "mail": e.target.mail.value,
      "content": body,
      "title":e.target.title.value
    });
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://localhost:8083/api", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
  //

  return (
    <div className="App">
      <form onSubmit={handleMail}>
        <div className="div1">
     <li>  Гарчиг </li> 
        <Input style={{width:"1200px", marginBottom:"20px" ,marginTop:"10px"}} name="title"/>
        {/* Текст
        <input  name="text"/> */}

<div className="div2">
        <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            init={{
              // width: 1200,
              height: "45vh",
              align:"center",
              menubar: true,

              plugins: [
                "a11ychecker",
                "advlist",
                "advcode",
                "advtable",
                "autolink",
                "checklist",
                "export",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "powerpaste",
                "fullscreen",
                "formatpainter",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | casechange blocks | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
              selector: "textarea#drive",
              file_picker_types: "file image media",
              quickbars_insert_toolbar: "quickimage quicktable ",
              quickbars_image_toolbar:
                "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
              quickbars_selection_toolbar:
                "bold italic alignleft aligncenter alignright alignjustify ",
              automatic_uploads: true,
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement("input");
                if (meta.filetype === "file") {
                  input.setAttribute("type", "file");
                  input.onchange = function () {
                    var file = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                      var id = "blobid" + new Date().getTime();
                      var blobCache = editorRef.current.editorUpload.blobCache;
                      var base64 = reader.result.split(",")[1];
                      var blobInfo = blobCache.create(id, file, base64);
                      let data = new FormData();
                      data.append("file", blobInfo.blob());
                      axios
                        .post(
                          `${process.env.REACT_APP_BASE_URL}/image/file`,
                          data
                        )
                        .then(function (res) {
                          res.data.file.map((file) => {
                            return cb(
                              `${process.env.REACT_APP_BASE_URL}/uploads/${file}`
                            );
                          });
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
                if (meta.filetype === "image") {
                  // var input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = function () {
                    var file = this.files[0];
                    var reader = new FileReader();
                    reader.onload = function () {
                      var id = "blobid" + new Date().getTime();
                      var blobCache = editorRef.current.editorUpload.blobCache;
                      var base64 = reader.result.split(",")[1];
                      var blobInfo = blobCache.create(id, file, base64);
                      let data = new FormData();
                      data.append(
                        "cover_img",
                        blobInfo.blob(),
                        blobInfo.filename()
                      );
                      axios
                        .post(`${process.env.REACT_APP_BASE_URL}/image`, data)
                        .then(function (res) {
                          res.data.images.map((image) => {
                            return cb(
                              ` ${process.env.REACT_APP_API_URL}/uploads/${image}`
                            );
                          });
                        })
                        .catch(function (err) {
                          console.log(err);
                        });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }
              },
            }}
          />
</div>

        {/* <input name="mail" style={{ height: "200px", width: "200px" }} /> */}
        <button onClick={log}  className="btn_submit" type="submit">send</button>
        <li style={{marginTop :" 20px"}}>Явуулах имайл ууд</li>
        <TextArea  style={{ width: 1200 , marginTop:"10px"}} name="mail" rows={10}/>
  
        </div>
      </form>
    </div>
  );
}

export default App;
