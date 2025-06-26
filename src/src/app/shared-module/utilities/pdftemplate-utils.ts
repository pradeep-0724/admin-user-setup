import htmlToPdfmake from 'html-to-pdfmake';
export interface  pdfTemplate1 {
    isTax?:boolean,
    isTds?:boolean,
    contents:any[],
    headerDetails:{
        companyname:string,
        companynameNative?:string,
        companyAddress?:string
        crnNo?:string,
        trnNo?:string,
        panNo?:string,
        mobileNo?:string,
        companyEmailId?:string,
        pdfTitle?:string,
        companyLogo:string,
    },
    footerDetails:{
        companyname:string,
        companynameNative?:string,
        mobileNo?:string,
        companyEmailId?:string,
        poweredBy?:string,
        systemGenerated?:string,

     }

}
export interface pdfTemplate1Table{
    body:any,
    widths:any
}
export interface narrationAndSignature{
    narration?:string,
    signature?:string
    isNarration:boolean,
    isSignature:boolean,
    forSignature?:string,
    authorizedSignature?:string,
}

export function generatePdfTemplate1(pdfTemplate1:pdfTemplate1){
  return {
    content:pdfTemplate1.contents,
    styles: {
        titleheader: { fontSize: 12, bold: true },
        tableHeader: { fontSize: 11, bold: true },
        subheader: { fontSize: 11, bold: true },
        contentBold: { fontSize: 11, bold: true },
        content: { fontSize: 11, bold: false },
        itemcontent:{fontSize:9,bold:false,italics:true},
        itemcontentBold:{fontSize:9,bold:true,italics:true}
    },
    pageOrientation: 'potrait',
    pageSize: 'A4',
    pageMargins: [2, 90.2, 2, 43],
    images: {
        companyLogo:'data:image/png;base64,'+ pdfTemplate1.headerDetails.companyLogo,
    },
    header: function (currentPage, pageCount, pageSize) {
        let crnTrnText=[];
        if(pdfTemplate1.isTax){
            if(pdfTemplate1.headerDetails.crnNo){
                crnTrnText.push({ text: 'CRN: ', style: 'contentBold' })
                crnTrnText.push( { text: `${pdfTemplate1.headerDetails.crnNo}`, style: 'content' })
                crnTrnText.push({ text: '     ', style: 'content' })
            }
            if(pdfTemplate1.headerDetails.trnNo){
                crnTrnText.push({ text:pdfTemplate1.isTds?'TRN: ':'GSTIN: ', style: 'contentBold' })
                crnTrnText.push( { text: `${pdfTemplate1.headerDetails.trnNo}`, style: 'content' }) 
            }
            if(pdfTemplate1.headerDetails.panNo){
                crnTrnText.push({ text: '  PAN: ', style: 'contentBold' })
                crnTrnText.push( { text: `${pdfTemplate1.headerDetails.panNo}`, style: 'content' })
                crnTrnText.push({ text: '     ', style: 'content' })
            }
        }
       


        return [
            {
                margin: [2, 2, 2, 0],
                table: {
                    widths: ['20%', '80%'],
                    body: [
                        [
                            getCompanyLogo(pdfTemplate1.headerDetails.companyLogo),
                            {
                                stack: [
                                    { text: `${pdfTemplate1.headerDetails.companyname}`, style: 'titleheader' },
                                    { text:pdfTemplate1.headerDetails.companynameNative? `${pdfTemplate1.headerDetails.companynameNative} \n`:'',font:'Arial', style: 'subheader' },
                                    { text: `${pdfTemplate1.headerDetails.companyAddress}`, style:'content' },
                                    {
                                        text:crnTrnText
                                    },
                                    {
                                        text: [
                                            { text: 'Mobile: ', style: 'contentBold' },
                                            { text: `${pdfTemplate1.headerDetails.mobileNo}`, style: 'content' },
                                            { text: '     ', style: 'content' },
                                            { text: '| Email: ', style: 'contentBold' },
                                            { text: `${pdfTemplate1.headerDetails.companyEmailId}`, style: 'content' }
                                        ]
                                    }
                                ],
                            }




                        ]
                    ]
                },
                layout: {
                    hLineWidth: function () { return .7; },
                    vLineWidth: function () { return .7; },
                    hLineColor: function () { return 'black'; },
                    vLineColor: function () { return 'black'; }
                }

            },
            {    margin: [2, 0, 2, 0],
                table: {
                    widths: ['100%'],
                    body: [
                        [
                       {  text: `${pdfTemplate1.headerDetails.pdfTitle} \n`, font:'Arial', alignment: 'center', style: 'tableHeader', border:[false,false,false,true] 
          }
                    ]
                    ]
                },
                layout: {
                    hLineWidth: function () { return .7; },
                    vLineWidth: function () { return .7; },
                    hLineColor: function () { return 'black'; },
                    vLineColor: function () { return 'black'; }
                },
            }
        ];

    },
    footer: function (currentPage, pageCount,pageSize) {
       return[ {
        margin: [2, 2, 2, 0],
        stack:[
            {text: `${pdfTemplate1.footerDetails.systemGenerated}  `, style: 'contentBold',alignment:'center',margin: [0, 2,0, 2],},
              {
              table: {
                  widths:['100%'],
                  body: [
                     [{
                        columns:[
                         {
                            width : '70%',
                            stack:[
                                {
                                    text: [
                                        { text: `Mobile: ${pdfTemplate1.footerDetails.mobileNo}  `, style: 'contentBold' },
                                        { text: `| Email: ${pdfTemplate1.footerDetails.companyEmailId}  `, style: 'contentBold' }
                                    ]
                                }
                            ]
                         },
                         { text:`${pdfTemplate1.footerDetails.poweredBy}  `, style: 'contentBold',alignment:'right',margin: [0, 0,0, 0] },
                        ]
                     } 
                     ]
                  ]
              },
              layout: {
                  hLineWidth: function (i, node) {
                      return.7
                  },
                  vLineWidth: function (i, node) {
                      return.7
                  },
                  hLineColor: function (i, node) {
                      return 'black'
                  },
                  vLineColor: function (i, node) {
                      return 'black'
                  },
              }
          },

        ]
       }];
   },
    background: function (currentPage, pageSize) {
        return {
            table: {
                widths: [pageSize.width - 15],
                heights: [pageSize.height - 15],
                body: [['']]
            },
            margin: 2,
            layout: {
                hLineWidth: function () { return 1.7; },
                vLineWidth: function () { return 1.7; },
                hLineColor: function () { return '#13120f'; },
                vLineColor: function () { return '#13120f'; }
            },
        };
    },
};
}

export function topBottomBorderTable(templateSettingsData:pdfTemplate1Table) {
     return {
        table: {
            dontBreakRows: true,
            widths:templateSettingsData.widths,
            body: templateSettingsData.body
        },
        layout: {
            hLineWidth: function (i, node) {
                return .7
            },
            vLineWidth: function (i, node) {
                return .7
            },
            hLineColor: function (i, node) {
                return 'black'
            },
            vLineColor: function (i, node) {
                return 'black'
            },
        }
    }
}

export function bottomBorderTable(templateSettingsData:pdfTemplate1Table) {
    return {
       table: {
           dontBreakRows: true,
           widths:templateSettingsData.widths,
           body: templateSettingsData.body
       },
       layout: {
           hLineWidth: function (i, node) {
               return i==0?0:.7
           },
           vLineWidth: function (i, node) {
               return .7
           },
           hLineColor: function (i, node) {
               return 'black'
           },
           vLineColor: function (i, node) {
               return 'black'
           },
       }
   }
}

export function getApprovalsTable(approvals:any=[]) {
    let body=[
        [{
            margin: [0, 5, 0, 40],
            columns: []
        }],
    ]
    approvals.forEach(approval => {
        body[0][0].columns.push({ text: `${approval}: `, style: 'content' }) 
    });
    return bottomBorderTable({widths:['100%'],body})
    
}

export function getTermsAndConditionTableSamePage(termsandCondition:any){
    let  body:any= [
        [{
            stack: [
                { text: 'Terms and Conditions', style: 'contentBold',alignment:'center' },
            ]
        }],
    ]
    body[0][0].stack.push({ style: 'content', stack: htmlToPdfmake(termsandCondition) })
    return  bottomBorderTable({widths:['100%'],body})
}
export function getTermsAndConditionTableNextPage(termsandCondition:any){
    let  body:any= [
        [{
            stack: [
                { text: 'Terms and Conditions', style: 'contentBold',alignment:'center' },
            ]
        }],
    ]
    body[0][0].stack.push({ style: 'content', stack: htmlToPdfmake(termsandCondition) })
    return [topBottomBorderTable({widths:['100%'],body})]
}

export function getNarationSignature(data:narrationAndSignature) {
    if(!data.isNarration && !data.isSignature) return {}
    let widths=[];
    let body=[ [
        { 
            stack: [
                { text: 'Narration:', style: 'contentBold' },
                 { text: `${data.narration}`, style: 'content' },
            ]
        },
        {
            stack: [

                { text:data.forSignature?`${data.forSignature}`:' ', style: 'content', alignment: 'right', },
                getSignatureImageColumn(data.signature,90,90),
                { text:data.authorizedSignature?`${data.authorizedSignature}` :' ', style: 'content', alignment: 'right', }

            ],
        },

    ]];
    widths=['100%'] 
    if(data.isNarration && data.isSignature){
        widths=['70%','30%'];
    }
    if(!data.isNarration && data.isSignature){
        body[0].splice(0,1)
    }
    if(data.isNarration && !data.isSignature){
        body[0].splice(1,1)
    }



    return   bottomBorderTable({widths,body})
    
}

export function getSignatureImageColumn(imageBase64:string,width=70,height=50) {
    const signature = imageBase64;
    let no_img_col =   {
        alignment: 'right',
         canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: width,
                h: height,
                r: 0,
                lineColor: '#FFFFFF',
              },
            ],
            width:width,
            height:height,
           margin: [0, 5, 0, 5],
    }
    let img_col ={alignment: 'right',  margin: [0, 5, 0, 5],  image: '', fit: [width,height]}
    if (signature) {
      img_col.image = 'data:image/png;base64,' + signature
      return img_col
    }
     return no_img_col
  }

export function getCompanyLogo(imageBase64) {
    const company_logo = imageBase64;
    let no_img_col =   {
        alignment: 'right',
        canvas: [
             {
               type: 'rect',
               x: 0,
               y: 0,
               w: 0,
               h: 55,
               r: 0,
               lineColor: '#FFFFFF',
             },
           ],
        
   }
    let img_col =  {
        alignment: 'center',
        image:'companyLogo',
        width:100 ,
        height:55,
        margin: [0, 2, 0, 2],
    }
    if (company_logo) {
      return img_col
    }
     return no_img_col
}

export function pdfGenerateWithoutHeaderFooter(contents=[]) {
    let pdfSection={
     content:contents,
     pageOrientation: 'potrait',
     pageSize: 'A4',
     pageMargins: [2, 2, 2, 2],
     background: function (currentPage, pageSize) {
        return {
            table: {
                widths: [pageSize.width - 15],
                heights: [pageSize.height - 15],
                body: [['']]
            },
            margin: 2,
            layout: {
                hLineWidth: function () { return 1.7; },
                vLineWidth: function () { return 1.7; },
                hLineColor: function () { return '#13120f'; },
                vLineColor: function () { return '#13120f'; }
            },
        };
    },
    }
    return pdfSection
  }




