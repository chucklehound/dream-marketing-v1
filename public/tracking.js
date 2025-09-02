(function(){
    const p=(n)=>new URLSearchParams(location.search).get(n);
    const g=(n)=>document.cookie.split(`; ${n}=`).pop()?.split(';')[0];
    const s=(n,v)=>document.cookie=`${n}=${v};path=/;max-age=${60*60*24*365*5}`;
    
    // Get the script tag's ID parameter
    const scriptTag = document.currentScript;
    const accountId = new URLSearchParams(scriptTag.src.split('?')[1]).get('id');
    
    fetch('https://apiv2.usedream.ai/site-visit/verify-tag/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            accountId,
            domain:window.location.hostname,
            url:window.location.href
        })
    }).catch(()=>{});
    
    if(p('utm_source')==='dream'){
        const d={pid:p('dream_pid'),oid:p('dream_oid')};
        if(d.pid&&d.oid)s('dream_tracking',JSON.stringify(d));
    }
    
    const t=g('dream_tracking');
    if(t)fetch('https://apiv2.usedream.ai/site-visit/',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            ...JSON.parse(t),
            accountId,
            url:window.location.href
        })
    }).catch(()=>{});
})();