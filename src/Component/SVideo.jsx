import React, { useState } from 'react';
import AWS from 'aws-sdk';

const SVideo = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file.type === 'video/mp4') {
      setFile(file);
    } else {
      alert('Please upload an MP4 file.');
    }
  };

  const handleUpload = () => {
    setUploading(true);
    setProgress(0);

    const s3 = new AWS.S3({
      accessKeyId: 'AKIAYZNTKYMUH3FMPCGU',
      secretAccessKey: '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',
      
    });

    const params = {
      Bucket: 'mybucket-upload-video',
      Key: file.name,
      Body: file,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log(err);
        alert('Upload failed!');
      } else {
        console.log(data);
        setUploading(false);
        setProgress(100);
        setUploaded(true);
      }
    }).on('httpUploadProgress', function (progressEvent) {
      const percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setProgress(percentage);
    });
  };

  return (
    <div>
      {uploaded ? (
         
        <video controls src={`https://mybucket-upload-video.s3.amazonaws.com/${file.name}`} />
       
      
        
      ) : (
        <div>
          <input type="file" accept="video/mp4" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>
          {uploading && <progress value={progress} max="100" />}
        </div>
      )}
      
    </div>
  );
};

export default SVideo;
