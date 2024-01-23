import * as React from 'react';
import { Dropzone, FileMosaic } from '@dropzone-ui/react';
import '../../index.css'
function TestDropZone() {

  const [files, setFiles] = React.useState([]);
  const updateFiles = (incommingFiles) => {
    setFiles(incommingFiles);
  };

    
  return (
    <Dropzone maxFiles={1} onChange={updateFiles} value={files}>
      {files.map((file) => (
        <FileMosaic key={file} {...file} preview />
      ))}
    </Dropzone>
  );
}

export default TestDropZone