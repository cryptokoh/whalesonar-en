$(function () {
    
    var whale_sounds = [document.getElementById("whale1")];
    var dolphin_sounds = [document.getElementById("dolphin1"), document.getElementById("dolphin2"), document.getElementById("dolphin3")];
    var orca_sounds = [document.getElementById("orca1"), document.getElementById("orca2")];
        
    /*------ Config -------*/
    
    var MODE = 'smoke';
          
    var LIFE_INTERVAL = 15;
    var DEFAULT_SP = 10000;
    var COOKIE_EXPIRES = 90;    
    var BLACK_LIST = '';     
             
    var whales = {
        dolphin : {
            title : 'Dolphin',
            width : '100px',
            pic : './img/dolphin.gif',
            min_gests : 10,
            max_gests : 100,
            sound : dolphin_sounds[getRand(0,dolphin_sounds.length-1)],
            max_size_rise: 1.5 
        },
        orca : {
            title : 'Orca',
            width : '150px',
            pic : './img/orca2.gif',       
            min_gests : 100,
            max_gests : 1000,
            sound : orca_sounds[getRand(0,orca_sounds.length-1)],
            max_size_rise: 1.25
        },        
        humback_whale : {
            title : 'Humback whale',
            width : '200px',
            pic : './img/humback-whale.gif',
            min_gests : 1000,
            max_gests : 1500,
            sound : whale_sounds[getRand(0,whale_sounds.length-1)]
        },        
        fin_whale : {
            title : 'Fin whale',
            width : '220px',
            pic : './img/fin-whale.gif',
            min_gests : 1500,
            max_gests : 3000,
            sound : whale_sounds[getRand(0,whale_sounds.length-1)]
        },        
        blue_whale : {
            title : 'Blue whale',
            width : '280px',
            pic : './img/blue_whale.gif',
            min_gests : 3000,
            max_gests : Number.MAX_VALUE,
            sound : whale_sounds[getRand(0,whale_sounds.length-1)]
        }
    };
                 
    var balloon_bg = ['blue-bg', 'green-bg', 'pink-bg', 'yellow-bg', 'orange-bg'];
        
   
    var debug = false;
   
    var stop_mode = false;
    var show_only = '';      
      
    var isActive = true;
        
    document.addEventListener('visibilitychange', function(e) {
        if(document.visibilityState === 'hidden'){
            isActive = false; 
        } else {
            isActive = true; 
        }       
    }, false);
             
    if(MODE == 'smoke'){ 
        steem.config.set('websocket', 'wss://rpc.golos.io');
        var DOMAIN = 'https://smoke.io/';
        var coin_code = 'GOLOS';
    } else {
        var DOMAIN = 'https://steemit.com/';
        var coin_code = 'STEEM';
    }
              
   
    if((Cookies.get('name') !== 'null') && (Cookies.get('name') !== undefined)){
        $('#name').val(Cookies.get('name'));       
    }
    if(Cookies.get('min_sp') !== undefined){
        $('#min_sp').val(Cookies.get('min_sp'));
    } else {
        $('#min_sp').val(DEFAULT_SP);
    }
    if(Cookies.get('black_list') !== undefined){
        BLACK_LIST = Cookies.get('black_list');
        $('#black_list').val(BLACK_LIST);
    } else {
        $('#black_list').val(BLACK_LIST);
    }

    BLACK_LIST = BLACK_LIST.replace(/\s+/g, '').split(',');
       
    if(Cookies.get('sound_on') === 'on'){
       $('#sound_on').attr('checked', true);
    } else if((Cookies.get('sound_on') === 'off') || (Cookies.get('sound_on') === undefined)){        
         $('#sound_on').attr('checked', false);
    }
    
    if(Cookies.get('balloon_on') === 'on'){
       $('#balloon_on').attr('checked', true);
    } else if((Cookies.get('balloon_on') === 'off') || (Cookies.get('balloon_on') === undefined)){        
         $('#balloon_on').attr('checked', false);
    }
    
    if((Cookies.get('bg_on') === 'on') || (Cookies.get('bg_on') === undefined)){
       $('#bg_on').attr('checked', true);       
       $('body').addClass('bg-image');
    } else if((Cookies.get('bg_on') === 'off')){        
       $('#bg_on').attr('checked', false);
       $('body').addClass('bg-image2');
    }
   
    var input_event = (('oninput' in document)) ? 'input' : 'keyup';
       
    $('#min_sp').on(input_event, function(){
        var sp = validate($(this).val());
        Cookies.set('min_sp', $('#min_sp').val(), {expires: COOKIE_EXPIRES});
        $(this).val(sp);
    });
    
    $('#name').on(input_event, function(){
        Cookies.set('name', $('#name').val(), {expires: COOKIE_EXPIRES});
    });
    
    $('#black_list').on(input_event, function(){        
        Cookies.set('black_list', $('#black_list').val(), {expires: COOKIE_EXPIRES});
        BLACK_LIST = $('#black_list').val().replace(/\s+/g, '').split(',');
    });
    
    $('#bg_on').on('change', function(){
        $('body').toggleClass('bg-image2');
        $('body').toggleClass('bg-image');
        
        if($('#bg_on').is(':checked')){
            Cookies.set('bg_on', 'on', {expires: COOKIE_EXPIRES});
        } else { 
            Cookies.set('bg_on', 'off', {expires: COOKIE_EXPIRES});
        }    
    });
   
    $('#balloon_on').on('change', function(){
        
        if($('#balloon_on').is(':checked')){
            $('.switch-balloon').removeClass('hidden');  
            Cookies.set('balloon_on', 'on', {expires: COOKIE_EXPIRES});            
        } else { 
            $('.switch-balloon').addClass('hidden'); 
            Cookies.set('balloon_on', 'off', {expires: COOKIE_EXPIRES});             
        }    
    });
    
   
    $('#sound_on').on('change', function(){       
        if($('#sound_on').is(':checked')){
            Cookies.set('sound_on', 'on', {expires: COOKIE_EXPIRES});
        } else { 
            Cookies.set('sound_on', 'off', {expires: COOKIE_EXPIRES});
        }       
    });
       
    $('body').on('click', '.author-link-overlay', function(){
        var link = $(this).data('link');
        if(link !== ''){
            window.open(link);
        }        
    });
        
    $('#minimize').click(function (e) {
        $(this).toggleClass('rotate-180');

        $('.settings-box .wrapper').slideToggle(500, function(){$('#minimize').attr('style', 'display: block !important;');});
    });
                    
    $('body').on('mouseover', '.creature, .creature0', function(){               
         
         var h_space = $(this).offset().top*1 + $(this).height()*1 + $(this).find('.tooltip').height()*1 + 13;
         
         if(h_space > $(window).height()*1){            
             var delta = $(this).height() - (h_space - $(window).height());
             $(this).find('.tooltip').css('top', delta+'px');
         } else {
             $(this).find('.tooltip').css('top', '');
         }
          
         $(this).find('.tooltip').show();  
         $(this).find('.voter-title').hide();
    });
    $('body').on('mouseout', '.creature, .creature0', function(){
         $(this).find('.tooltip').hide(); 
         $(this).find('.voter-title').show();
    });
       
    steem.api.getDynamicGlobalProperties(function (err, steem_data) {
        
        if (err === null) {

            steem.api.streamOperations(function (err, operations) {

                if (err === null) {
                    
                    operations.forEach(function (operation) {
                       
                        if ((operation.voter !== undefined) && (BLACK_LIST.indexOf(operation.voter) === -1)) {
                            
                           
                            steem.api.getAccounts([operation.voter], function (err, account) {
                               
                                if ((err === null)) {                                    
                                   
                                    var SP = getSteemPower(steem_data, account);
                                                                        
                                    if((show_only === '') || (show_only === account[0].name)){
                                        if (SP >= $('#min_sp').val()*1) {
                                        
                                            steem.api.getContent(operation.author, operation.permlink, function(err, post) {
                                                                                   
                                                steem.api.getActiveVotes(operation.author, operation.permlink, function(err, post_votes) {
                                                    
                                                    if(err === null){
                                                                                                   
                                                    var data = {
                                                      
                                                        author: operation.author,
                                                       
                                                        permlink: DOMAIN+'@'+operation.author+'/'+operation.permlink,
                                                        link: DOMAIN+'@'+account[0].name,
                                                        post_payout: post.pending_payout_value,
                                                        time_ago: getTimeDiff(post.created, true),
                                                       
                                                        voter: account[0].name,
                                                        upvote_profit: calcUpvoteProfit(post_votes, account[0].name, post),
                                                        votes_count: post_votes.length,
                                                        voter_reputation: getReputation(account[0].reputation),                                                
                                                        voter_id: 'v'+account[0].id, 
                                                        sp: (SP*1).toFixed(0),
                                                        vp: (account[0].voting_power / 100).toFixed(1), 
                                                       
                                                        weight: operation.weight / 100, 
                                                       
                                                        sound: false,
                                                        gests: account[0].vesting_shares.split(' ')[0]
                                                    };
                                                   
                                                    releaseWhale(data);
                                                }   
                                                });                                       
                                                
                                            });                                            
                                        }
                                    }
                                } else {
                                    console.log('Error! Cant get account:', err);
                                }
                            });
                        }
                    });
                } else {
                    console.log('Error! Cant get stream:', err);
                }
            });
        } else {
            console.log('Error! Cant get global properties:', err);
        }
    });
  
    function calcUpvoteProfit(upvotes, voter, post_data){
        
        var _upvote = 0;
        var result = {};
      
        upvotes.forEach(function (upvote) { 
            if(upvote.voter === voter){
                _upvote = upvote;                
            }
        });
        
        if(_upvote == 0) { return 0;}
               
        var split_payout = (post_data.pending_payout_value).split(' ');
        
       
        var upvote_weight = _upvote.rshares / post_data.abs_rshares; 
      
        result.author = get30MinPenalty('author', split_payout[0] * upvote_weight, post_data.created).toFixed(3) + ' ' + split_payout[1];
     
        result.curator = get30MinPenalty('curator', split_payout[0] * upvote_weight, post_data.created).toFixed(3) + ' ' + split_payout[1];
        
        return result;
    }    
    
    function get30MinPenalty(type, value, credate){
        var time_diff = getTimeDiff(credate, false);
        
        if(time_diff*1 >= 30) {
            return (type == 'author') ? value*0.75 : value*0.25;
        }        
        return (type == 'author') ? value*0.75 + value*0.25*(1 - time_diff/30)
                                  : value*0.25 - value*0.25*(1 - time_diff/30);    
    }
        
    function getReputation(crude_rep){
        if(isNaN(crude_rep)){ crude_rep = '0';}
        var is_negative = crude_rep.charAt(0) === '-';
       
        crude_rep = is_negative ? crude_rep.substr(1): crude_rep;
        var out = Math.log10(crude_rep);
        out = Math.max(out - 9, 0); 
        out = (is_negative ? -1 : 1)*out;
        out = (out * 9) + 25; 

        return out.toFixed(2);
    }
       
    function getSteemPower(steem_data, acc) {
        var movementGlobal = steem_data.total_vesting_shares.split(' ')[0];
        var powerGlobal = steem_data.total_vesting_fund_steem.split(' ')[0];
        var accVests = acc[0].vesting_shares.split(' ')[0];
        return (powerGlobal * (accVests / movementGlobal)).toFixed(3);
    }
       
    function releaseWhale(whale_data) {
               
        whale_data = classificate(whale_data);

        _d(whale_data);
               
        if(isActive){ 
           createWhale(whale_data);
        }        
               
        if (whale_data.sound && $('#sound_on').is(':checked')) {
            setTimeout(function () {               
               whale_data.sound.play();
            }, 1000);
        }
    }
       
    function createWhale(data){
        
        if(data.specie === '') { return false;}
        
        var specie = data.specie; 
        
        if(specie in whales){      
           
            var author_bg = (data.author === $('#name').val()) ? 'burn-bg' : balloon_bg[getRand(0,4)]; 
            var balloon_on = ($('#balloon_on').is(':checked')) ? 'switch-balloon' : 'switch-balloon hidden';
                        
            var whale_width = getWhaleSize(whales[specie], data);
           
            if($('*').is('#'+data.voter_id)) {                        
                if($('#balloon_on').is(':checked')){
                    
                    $('#'+data.voter_id+' .author-balloon span').text(data.author);
                   
                    $('#'+data.voter_id+' .author-link-overlay').data('link', data.permlink);
                  
                    $('#'+data.voter_id+' .sp-title span').text(data.weight+"%");
                   
                    $('#'+data.voter_id+' .author-balloon').removeClass().addClass('author-balloon').addClass('is-right-side').addClass(author_bg).addClass(balloon_on);
                }            
            } else {             

                if(!stop_mode){ 
                   
                    $("<style id='keyframe_"+data.voter_id+"' type='text/css'>"+getLocus(data.voter_id)+" </style>").appendTo("head");
                } else {
                    
                    $("<style id='keyframe_"+data.voter_id+"' type='text/css'> #"+data.voter_id+"{top: 60%; left: 65%;} </style>").appendTo("head");
                }          
               
                var voter_bg = (data.voter === $('#name').val()) ? 'burn-bg' : 'blue-bg'; 
             
                var container = "<div class='creature' id='"+data.voter_id+"' style='animation:swim_"+data.voter_id+" "+LIFE_INTERVAL+"s 1 "+getAnimationType()+";'>\n\
                                 <a href='"+data.link+"'  target='_blank'>\n\
                                 <img src='"+whales[specie].pic+"' alt='"+whales[specie].alt+"' width='"+whale_width+"'/>\n\
                                 </a>\n\
                                 <span class='voter-title is-right-side "+voter_bg+" "+balloon_on+"'>"+data.voter+"</span>\n\
                                    <svg class='title-curve-line "+balloon_on+"'>\n\
                                      <path fill='none' stroke='#99b' stroke-width='1' d='M30,0 Q30,50 60,60' />\n\
                                    </svg>\n\
                                 <span class='author-balloon is-right-side "+author_bg+" "+balloon_on+"'><span>"+data.author+"</span></span>\n\
                                 <div class='sp-title is-right-side "+balloon_on+"'><span>"+data.weight+"%</span></div>\n\
                                 <span class='ballon-nippel "+balloon_on+"'></span>\n\
                                 <div class='author-link-overlay "+balloon_on+"' data-link='"+data.permlink+"'></div>\n\
                                "+getTooltip(data)+"</div>";
                $('body').append(container);
              
                $('#'+data.voter_id).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',   
                    function(e) {                   
                        if(!stop_mode){ 
                            $('#'+data.voter_id).remove();                
                       
                            $('#keyframe_'+data.voter_id).remove();
                        }
                    }
                );
            }    
        }
    }
    $('body').on('click', '.author, .voter', function(){
        window.open($(this).data('link'));        
    });
       
    function getWhaleSize(whale, data){
        var min_rise = 1;
        if('max_size_rise' in whale){
            var width = (whale.width).replace('px', '')*1;
            var k_increase = (((whale.max_size_rise - min_rise) * (data.mgests - whale.min_gests)) / (whale.max_gests - whale.min_gests)) + 1;
            return (width * k_increase) + 'px';
        }
        return whale.width;
    }
        
    function getTooltip(data){
        return '<div class="tooltip is-right-side">\n\
                <table>\n\
                    <tr><td colspan="2" class="hd">Curator information</td></tr>\n\
                    <tr><td>Nickname:</td><td><span class="voter" data-link="'+data.link+'">'+data.voter+'</span></td></tr>\n\
                    <tr><td>Reputation:</td><td><span>'+data.voter_reputation+'</span></td></tr>\n\
                    <tr><td>Total SP:</td><td><span>'+data.sp*1+' '+coin_code+'</span></td></tr>\n\
                    <tr><td><span>Available SP %:</span></td><td class="percent">'+data.vp+'%</td></tr>\n\
                    <tr><td>Vote %:</td><td class="percent">'+data.weight+'%</td></tr>\n\
                    <tr><td colspan="2" class="hd">Upvote rewards</td></tr>\n\
                    <tr><td>Author:</td><td class="coins"><span>'+data.upvote_profit.author+'</span></td></tr>\n\
                    <tr><td>Curator:</td><td class="coins"><span>'+data.upvote_profit.curator+'</span></td></tr>\n\
                    <tr><td colspan="2" class="hd">Post information</td></tr>\n\
                    <tr><td>Author:</td><td><span class="author" data-link="'+data.permlink+'">'+data.author+'</span></td></tr>\n\
                    <tr><td><span>Total reward:</span></td><td class="coins">'+data.post_payout+'</td></tr>\n\
                    <tr><td><span>Upvote count:</span></td><td><span>'+data.votes_count+'</span></td></tr>\n\
                    <tr><td>Time:</td><td><span>'+data.time_ago+'</span></td></tr></table>';
    }
       
    function getTimeDiff(tm_string, format_local){
        
        var offset = moment().utcOffset(); // минуты
        var post_unx = moment(tm_string, moment.ISO_8601);       
        var post_date = moment(post_unx+offset*60*1000); // мс
        
        if(format_local === true){
          
             return post_date.from(moment([]));  
        } else {
             return (moment([]) - post_date) / (1000 * 60);  
        }          
    }  
   
    function classificate(data) {
       
        mgests = (data.gests*1) / 1000000;
        
        for (specie in whales){
            if((mgests > whales[specie].min_gests) && (mgests <= whales[specie].max_gests)){
                data.sound = whales[specie].sound;
                data.specie = specie;
                data.mgests = mgests;
            }            
        }        
        return data;        
    }
        
    function getLocus(voter_id){
        var top_poin_interval_1 = getRand(15, 50);
        var top_poin_interval_2 = top_poin_interval_1+7;
        
       
        var locus_set = [
        
            "@keyframes swim_"+voter_id+"{from{left:-5%; top: "+getRand(10, 82)+"%;} to{left:100%; top: "+getRand(10, 82)+"%;}} @-moz-keyframes swim_"+voter_id+"{from{left:-5%; top: "+getRand(10, 82)+"%;} to{left:100%; top: "+getRand(10, 82)+"%;}} @-webkit-keyframes swim_"+voter_id+"{from{left:-5%; top: "+getRand(10, 82)+"%;} to{left:100%; top: "+getRand(10, 82)+"%;}}",
            "@keyframes swim_"+voter_id+"{from{left:-5%; top: "+getRand(5, 20)+"%;} "+top_poin_interval_1+"%{top:0%; transform: rotate(-25deg);} "+top_poin_interval_2+"%{top:-6%; transform: rotate(0deg);} to{left:100%; top: "+getRand(10, 40)+"%;}} @-moz-keyframes swim_"+voter_id+"{from{left:-6%; top: "+getRand(5, 20)+"%;} "+top_poin_interval_1+"{top:0%; transform: rotate(-25deg);} "+top_poin_interval_2+"%{top:-6%; transform: rotate(0deg);} to{left:100%; top: "+getRand(10, 40)+"%;}} @-webkit-keyframes swim_"+voter_id+"{from{left:-5%; top: "+getRand(5, 20)+"%;} "+top_poin_interval_1+"%{top:0%; transform: rotate(-25deg);} "+top_poin_interval_2+"%{top:-5%; transform: rotate(0deg);} to{left:100%; top: "+getRand(10, 40)+"%;}}",
      
            "@keyframes swim_"+voter_id+"{from{right:-5%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} @-moz-keyframes swim_"+voter_id+"{from{right:-5%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} @-webkit-keyframes swim_"+voter_id+"{from{right:-5%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} #"+voter_id+" .is-right-side {transform:scaleX(-1);}",
            "@keyframes swim_"+voter_id+"{from{right:-5%; top: "+getRand(5, 82)+"%; transform:scaleX(-1);} "+top_poin_interval_1+"%{top:0%; transform: rotate(25deg) scaleX(-1);} "+top_poin_interval_2+"%{top:-6%; transform: rotate(0deg) scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} @-moz-keyframes swim_"+voter_id+"{from{right:-6%; top: "+getRand(5, 82)+"%; transform:scaleX(-1);} "+top_poin_interval_1+"{top:0%; transform: rotate(25deg) scaleX(-1);} "+top_poin_interval_2+"%{top:-6%; transform: rotate(0deg) scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} @-webkit-keyframes swim_"+voter_id+"{from{right:-5%; top: "+getRand(5, 82)+"%; transform:scaleX(-1);} "+top_poin_interval_1+"%{top:0%; transform: rotate(25deg) scaleX(-1);} "+top_poin_interval_2+"%{top:-5%; transform: rotate(0deg) scaleX(-1);} to{right:100%; top: "+getRand(10, 82)+"%; transform:scaleX(-1);}} #"+voter_id+" .is-right-side {transform:scaleX(-1);}",
        ];      
        return locus_set[getRand(0, locus_set.length-1)];
    }
    
    
    function getRand(min, max) {
        var rand = min + Math.random() * (max + 1 - min);
        rand = Math.floor(rand);
        return rand*1;
    }
       
    function validate(str){ 
        return str.replace(/[^\d]/g, ''); 
    }
    
    function getAnimationType(){
        var types = ['linear', 'linear', 'ease-in', 'linear', 'ease-in-out'];
        return types[getRand(0, 4)];
    }
    
    function _d(param){
        if(debug){
            console.log(param);
        }
    }   
   
});


