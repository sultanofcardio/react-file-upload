import styles from './App.module.css';

import download from './img/download.svg'
import {ProgressBar} from "react-bootstrap"
import {useEffect, useRef, useState} from "react";
import axiosInstance from "./utils/axios";

function App() {

    const [selectedFile, setSelectedFile] = useState()
    const [progress, setProgress] = useState(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState(null)
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const fileInputRef = useRef(null)

    useEffect(() => {
        if(error) {
            setMessage("Error uploading file. Please try again")
        } else if (progress && progress >= 100) {
            setMessage("Upload successful!")
        } else {
            setMessage('')
        }
    }, [error, progress])

    const submitHandler = e => {
        e.preventDefault()
        if (!selectedFile) return;
        let formData = new FormData()
        formData.append("file", selectedFile)
        axiosInstance.post("/upload", formData, {
            headers: {"Content-Type": "multipart/form-data",},
            onUploadProgress: data => {
                console.log(data)
                const progress = Math.round((100 * data.loaded) / data.total)
                setProgress(progress)
            },
        }).then(response => {
            console.log(response)
        }).catch(e => {
            setError(e)
        })
    }

    return (
        <div className={styles.App}>
            <form action='/upload'
                  method='post'
                  encType="multipart/form-data"
                  onSubmit={submitHandler}>
                <div className={styles.touchArea}
                     onClick={() => {
                         if (fileInputRef.current) {
                             fileInputRef.current.click()
                         }
                     }}>
                    <img src={download} className={styles.downloadIcon} alt=''/>
                    <span className={styles.fileName}>
                        {
                            selectedFile ? selectedFile.name :
                                <strong>Choose a file</strong>
                        }
                    </span>
                    <input type='file'
                           name="file"
                           ref={fileInputRef}
                           className={styles.fileInput}
                           value=''
                           placeholder=''
                           onChange={e => {
                               setProgress(null)
                               setError(null)
                               setSubmitDisabled(false)
                               setSelectedFile(e.target.files[0])
                           }}/>
                </div>
                <input className={styles.submit}
                       type='submit'
                       disabled={submitDisabled}
                       value='Upload'/>
                {progress && <ProgressBar className={styles.progress} now={progress} label={`${progress}%`}/>}
                <span className={styles.success}>{message}</span>
            </form>
        </div>
    );
}

export default App;
