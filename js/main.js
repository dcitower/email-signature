let template = null;
let lastFilled = null;

$(function(){
    // load in the template
    $.get('template.html', function(res) {
        template = res;
    })

    // re-render every 500ms
    setInterval(function() {
        renderTemplate();
    }, 500)

    // tiny mce editor
    tinymce.init({
      selector: '#code-tinymce'
    });
})

function fillTemplate()
{
    let filled = template;

    const isInternal = $('#mobile').val() == '';
    const phone2 = isInternal ? '972.735.0701' : $('#mobile').val();

    filled = filled.replace('{{name}}', $('#name').val());
    filled = filled.replace('{{title}}', $('#title').val());
    filled = filled.replace('{{M}}', isInternal ? 'F' : 'M');
    filled = filled.replace('{{phone}}', $('#phone').val());
    filled = filled.replace('{{phone_link}}', onlyNumbers($('#phone').val()));
    filled = filled.replace('{{email}}', $('#email').val());
    filled = filled.replace('{{email_link}}', $('#email').val());
    filled = filled.replace('{{mobile}}', phone2);
    filled = filled.replace('{{mobile_link}}', onlyNumbers(phone2));

    return filled;
}

function onlyNumbers(val)
{
    return val.replace(/[^0-9]/g, '');
}

function renderTemplate() 
{
    const filled = fillTemplate()

    if(lastFilled == filled ) {
        return;
    }

    var doc = $('#preview')[0].contentWindow.document;
    doc.open();
    doc.write(filled);
    doc.close();
    
    $('#code-textarea').val(filled)
    tinymce.get("code-tinymce").setContent(filled);

    lastFilled = filled
}