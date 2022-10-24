let template_gmail = null;
let template_outlook = null;
let lastFilledGmail = null;
let lastFilledOutlook = null;

$(function(){
    // load in the template
    $.get('template-gmail.html', function(res) {
        template_gmail = res;
        console.log(res);
    })

    $.get('template-outlook.html', function(res) {
        template_outlook = res;
        console.log('Outlook: ',res);
    })

    // re-render every 500ms
    setInterval(function() {
        renderTemplate();
    }, 500)

    // tiny mce editor
    /*
    tinymce.init({
      selector: '#code-tinymce'
    });
    */
})

function fillTemplateGmail()
{
    let filled_gmail = template_gmail;

    const isInternal = $('#mobile').val() == '';
    const phone2 = isInternal ? '' : $('#mobile').val();

    filled_gmail = filled_gmail.replaceAll('{{fname}}', $('#fname').val());
    filled_gmail = filled_gmail.replaceAll('{{lname}}', $('#lname').val());
    filled_gmail = filled_gmail.replace('{{title}}', $('#title').val());
    filled_gmail = filled_gmail.replace('{{M}}', isInternal ? 'F' : 'M');
    filled_gmail = filled_gmail.replace('{{phone}}', $('#phone').val());
    filled_gmail = filled_gmail.replace('{{phone_link}}', onlyNumbers($('#phone').val()));
    filled_gmail = filled_gmail.replace('{{email}}', $('#email').val());
    filled_gmail = filled_gmail.replace('{{email_link}}', $('#email').val());
    filled_gmail = filled_gmail.replace('{{mobile}}', phone2);
    filled_gmail = filled_gmail.replace('{{mobile_link}}', onlyNumbers(phone2));
    filled_gmail = filled_gmail.replace('{{qr}}', $('#qr').val());

    return filled_gmail;
}

function fillTemplateOutlook()
{
    let filled_outlook = template_outlook;

    const isInternal = $('#mobile').val() == '';
    const phone2 = isInternal ? '' : $('#mobile').val();

    filled_outlook = filled_outlook.replaceAll('{{fname}}', $('#fname').val());
    filled_outlook = filled_outlook.replaceAll('{{lname}}', $('#lname').val());
    filled_outlook = filled_outlook.replace('{{title}}', $('#title').val());
    filled_outlook = filled_outlook.replace('{{M}}', isInternal ? 'F' : 'M');
    filled_outlook = filled_outlook.replace('{{phone}}', $('#phone').val());
    filled_outlook = filled_outlook.replace('{{phone_link}}', onlyNumbers($('#phone').val()));
    filled_outlook = filled_outlook.replace('{{email}}', $('#email').val());
    filled_outlook = filled_outlook.replace('{{email_link}}', $('#email').val());
    filled_outlook = filled_outlook.replace('{{mobile}}', phone2);
    filled_outlook = filled_outlook.replace('{{mobile_link}}', onlyNumbers(phone2));
    filled_outlook = filled_outlook.replace('{{qr}}', $('#qr').val());

    return filled_outlook;
}

function onlyNumbers(val)
{
    return val.replace(/[^0-9]/g, '');
}

function renderTemplate() 
{
    const filled_gmail = fillTemplateGmail()
    const filled_outlook = fillTemplateOutlook()

    if(lastFilledGmail == filled_gmail ) {
        return;
    }

    if(lastFilledOutlook == filled_outlook ) {
        return;
    }

    var doc_g = $('#preview')[0].contentWindow.document;
    doc_g.open();
    doc_g.write(filled_gmail);
    doc_g.close();

    $('#code-textarea-gmail').val(filled_gmail)
    $('#code-textarea-outlook').val(filled_outlook)
    // tinymce.get("code-tinymce").setContent(filled);

    lastFilledGmail = filled_gmail
    lastFilledOutlook = filled_outlook
}
