import { cloneDeep } from "lodash"
import { ArialFonts } from "src/app/core/constants/arialBase64formats"

type CompanyDetails={
  companyName:string,
  contactEmail:string,
  contactNumber:string
}
export function getHeader(headerTable:any) {
  let companyName=headerTable.companyName
  if(headerTable['companyNative']){
    companyName+=` | ${reorderMixedText(cloneDeep(headerTable['companyNative']))}`
  }
  let header= {
  margin: 5,
  columns: [{
    table: {
      widths: ['20%', '80%'],
      body: [
        [   headerTable.companyLogo,
            {
              width: "80%",
              border:[false,false,false,true],
              stack: [{ text: `${companyName} \n`, fontSize: 13,font:'Arial', bold: true, margin: [0, 0, 0, 2],border:[false,false,false,true]},
              { text: `${headerTable.companyAddress}\n`, fontSize: 9, bold: false, margin: [0, 0, 0, 2],border:[false,false,false,true] },
              { text: `${headerTable.companyMobileMail}\n`, fontSize: 9, bold: false, margin: [0, 0, 0, 2],border:[false,false,false,true] },
              { text: `${headerTable.companyGstPan}\n`, fontSize: 9, bold: false, margin: [0, 0, 0, 2],border:[false,false,false,true] }
            ]
            }
        ]
      ]
    },
    layout: {
      border:[false,false,false,true]
    }
  }]}
   return header

}

export function reorderMixedText(text) {
  const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0780-\u07BF\u07C0-\u07FF]/;
  if (!rtlRegex.test(text)) {
    return text;
  }
  return text
    .split(/([\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0780-\u07BF\u07C0-\u07FF\s]+|[^\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0780-\u07BF\u07C0-\u07FF\s]+)/g)
    .map((part) =>
      rtlRegex.test(part) ? part.split(" ").reverse().join(" ") : part
    )
    .reverse()
    .join("");
}
export function getFooter(companyName='',contactEmail='',contactNumber='',companyNativeName='') {
  let companyNameValue=companyName
  if(companyNativeName){
    companyNameValue+=` | ${reorderMixedText(cloneDeep(companyNativeName))}`
  }
  
  let footer= {
    margin:5,
    table: {
        widths: [ "40%", "40%", "20%" ],
        body: [
          [
              { text: `${companyNameValue} \n`,alignment: 'left', fontSize: 10,font:'Arial',border:[false,true,false,false]},
              {text: contactEmail, alignment: 'left' ,fontSize:10,border:[false,true,false,false]},
              {text: contactNumber, alignment: 'right' ,fontSize:10,border:[false,true,false,false]},
        ]]
      },
  }
    return footer
}

export function pdfGenerate(contents=[], headerDetails:any, companyDetails:CompanyDetails) {
  let pdfSection={
   header:getHeader(headerDetails),
   footer: getFooter(companyDetails.companyName,companyDetails.contactEmail,companyDetails.contactNumber,companyDetails['companyNative']),
   content:contents,
   pageOrientation: 'potrait',
   pageSize: 'A4',
   pageMargins: [20, 75, 20, 40],
   background: function (currentPage, pageSize) {
    return {
    table: {
    widths: [pageSize.width - 20],
    heights: [pageSize.height - 20],
    body: [['']]
    },
    margin: 5
    };
    },
  }
  return pdfSection

}

export function pdfGenerateWOHeaderFooter(contents=[]) {
  let pdfSection={
   content:contents,
   pageOrientation: 'potrait',
   pageSize: 'A4',
   pageMargins: [20, 75, 20, 40],
   background: function (currentPage, pageSize) {
    return {
    table: {
    widths: [pageSize.width - 20],
    heights: [pageSize.height - 20],
    body: [['']]
    },
    margin: 5
    };
    },
  }
  return pdfSection
}

export function addFonts(pdfMake){
  let pdfFonts = ArialFonts
  pdfMake.vfs['arial.ttf'] = pdfFonts.normal;
  pdfMake.vfs['arial-bold.ttf'] = pdfFonts.bold;
  pdfMake.vfs['arial-italic.ttf'] = pdfFonts.italic;
  pdfMake.vfs['arial-bold-italic.ttf'] = pdfFonts.boldItalic;
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf', 
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf' 
    },
    Arial: {
      normal: 'arial.ttf',
      bold: 'arial-bold.ttf',
      italics: 'arial-italic.ttf',
      bolditalics: 'arial-bold-italic.ttf'
    },
    
  };
}


export function addImageColumn(imageBase64:string,width=70,height=50) {
  const company_logo = imageBase64;
  let no_img_col = { text: '', style: 'logo', width:width,height:height, border:[false,false,false,true] };
  let img_col = { image: '', style: 'logo', width:width , height:height,margin:[10,5,0,0],border:[false,false,false,true]};
  if (company_logo) {
    img_col.image = 'data:image/png;base64,' + company_logo
    return img_col
  }
   return no_img_col
}

export function addDocumentColumn(imageBase64:string) {
  const document = imageBase64;
  let img_col = { image: '', height:400,width:500, margin:[10,5,0,0],border:[false,false,false,false]};
  if (document) {
    img_col.image = 'data:image/png;base64,' + document
    return img_col
  }
}

export function addressToText(address, noOfLines, chLimit) {
  if (!address) {
    if (noOfLines == 1) { if (!address) { return [""] } }
    else if (noOfLines == 2) { if (!address) { return ["", ""] } }
    else if (noOfLines == 3) { if (!address) { return ["", ""] } }
    else return [""]
  }

  let addressLen = 0

  const addressLine1 = address.address_line_1;
  addressLen += addressLine1.length

  const street = address.street || "";
  addressLen += street.length

  const state = address.state || "";
  addressLen += state.length

  const country = address.country || "";
  addressLen += country.length

  const pincode = address.pincode || "";
  addressLen += pincode.length

  if (addressLen == 0) {
    if (noOfLines == 1) { if (!address) { return [""] } }
    else if (noOfLines == 2) { if (!address) { return ["", ""] } }
    else if (noOfLines == 3) { if (!address) { return ["", ""] } }
    else return [""]
  }

  let addressText = addressLine1
  if (street) addressText?addressText += ", " + street:addressText += street
  if (state) addressText? addressText += ", " + state: addressText += state
  if (country)addressText? addressText += ", " + country :addressText +=country
  if (pincode)addressText? addressText += ", " + pincode :addressText +=pincode

  if (!addressText) return "\n\n\n"
  return addressText
}


