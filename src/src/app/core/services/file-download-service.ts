import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class FileDownLoadAandOpen {

  async writeAndOpenFile(data: Blob, fileName: string) {
     const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style','display:node');
      const objectUrl = URL.createObjectURL(data)
      a.href = objectUrl
      a.download=fileName
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      a.remove()

}
}
