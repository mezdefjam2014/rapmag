/* COMMENTS tab in the Studio: makes a batch of comments about what was just made in THE DROP or NEWS.
   The engine is a word bank (below) mixed around the subject, then "typed" the way people type. Nothing leaves this
   computer. A comment is never made twice for the same subject (remembered in this browser). */
(function(){
const R=p=>Math.random()<p,pick=a=>a[Math.floor(Math.random()*a.length)];
const esc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const bank=s=>s.trim().split('\n').map(x=>x.trim()).filter(Boolean);
/* tones: L good, H bad, S controversial, F funny, N questions and plain reactions.
   (a|b|) picks one. {a} artist or who the story is about, {a2} featured artist, {s} song,
   {he} {him} {his} {bro} {himx} follow the HIM / HER / GROUP switch, <sings|sing> follows one person or a group. */
const T={};
/* ------------------------------------------------ MUSIC (drops, new music news) */
T.music={
L:bank(`
{s} (is|been) on repeat (all day|since it dropped|all morning|for like an hour straight|)
(this|{s}) (is|might be|gotta be) {his} best (song|drop|record|one) (this year|in a minute|so far|yet|)
{bro} (snapped|went crazy|floated|slid|did {his} thing|cooked|went off|didn't miss|bodied this|blacked out) (on this|on this one|on here|)
the (beat|production|hook|flow|second verse|first verse|intro|chorus|bridge|sample|beat switch|outro) (is|was) (crazy|insane|too hard|so hard|nasty|ridiculous|different|stupid|so cold|unreal)
whoever (made|produced) this beat (need a raise|went crazy|deserve a plaque|was in they bag|understood the assignment)
{a} (don't|never|can't) miss
(ok|okay|alright|oh) {a} (i see you|i hear you|you got one|this the one|we see you)
(been|i been) (waiting on|waiting for|needing) this (one|drop|) (all week|for months|since the snippet|forever|)
the snippet (didn't do this justice|was hard but the full song crazy|had me waiting and it delivered)
(instant|immediate|straight|easy) (add to the playlist|replay|repeat|10|classic)
(song|track|record|anthem|banger) of the (summer|year|month|week)(, don't @ me|, idc|, no debate|)
(this|{s}) (going|about to go|finna go) (crazy|up|stupid|dumb) in the (car|whip|gym|club|function)
(i|) (need|needed) this in my (life|playlist|headphones|car) (asap|right now|immediately|)
(why|how) is (nobody|no one) talking about (this|{s}|{a})
{a} (is|been|stay) (so|way too|criminally|) underrated
(run it back|play it again|one more time|replay button broke|on my 10th listen|third time playing this)
(this|{s}) (hit|hits|hitting) different (at night|in the car|with headphones|on the aux|at 2am|)
(real|actual|good) music (is|) back
{a} (is|) really {himx}
(10/10|100/10|12/10|9.5/10|easy 10) (no notes|no debate|)
(we|i) (need|want) the (video|album|tape|deluxe|remix|part 2) (now|asap|next|tomorrow)
(who|who else) (here|listening) (before|b4) (this blow up|a million|it go viral|1M)
(first|early|here early|day one)(, and this hard|, {a} don't miss| and proud|)
(aux|the aux) (is|) mine (this weekend|today|for the rest of the week|after this)
(my|the) neighbors (know every word|about to hate me|gonna learn this song today)
{a} (and|x) {a2} (need|gotta|should) (drop|do) a (whole|joint|collab) (tape|album|ep)
{a2} (verse|feature|part) (was|is) (crazy|the best part|so smooth|perfect|a problem)
{a} and {a2} (on the same song|together|on one track) (is|was) (crazy|unfair|what we needed|a cheat code)
(stream|go stream|run up) {s} (rn|right now|today|)
(RAPAECHELON|this page|yall) (always|stay|) (putting|put) me on (to|) (good|new|real) music
(found|discovered) (this|{a}) (on|through) (here|this page|RAPAECHELON) and (i'm|) (hooked|a fan now|not mad|glad i did)
(added|saved|downloaded) (before the song even finished|at the first verse|in 10 seconds|immediately)
(this the one|yeah this the one|this it right here|ok this the one)
(chills|goosebumps|stank face) (the whole song|the whole time|at the hook|when the beat dropped)
(sheesh|yessir|woo|oh yeah|ok ok ok|aye|talk to em|talk yo talk|speak on it|say that)( {a}|)
{a} (in|is in) {his} (bag|prime|zone|own lane) (rn|right now|)
(growth|the growth|the improvement) (is crazy|from the last drop is crazy|showing)
(day one|been a) fan (since|from) (the first tape|way back|the soundcloud days|before the hype)(, proud|, this is it|)
this (deserve|deserves|need|needs) (way more|a million|10x the|more) (views|plays|streams|attention)
(the algorithm|youtube|ig) (finally|) (did|got) (something|one) right (for once|today|)
(🔥🔥🔥|🔥🔥|🔥🔥🔥🔥🔥|🔥💯|💯💯💯|🐐|🔥🔥🔥🔥|‼️‼️‼️)
(hard|this hard|too hard|so hard|crazy|this crazy|heat|pure heat|straight heat|flames|a banger|certified banger|a vibe|slaps|this slaps|goes hard|went crazy)
{a} (got|has|really got) (one|a hit|another one|a banger) (with this|here|on {his} hands|)
(the|that) (energy|delivery|cadence|pocket|voice|confidence) (on this|here|) (is|was) (crazy|unmatched|different|perfect|everything)
(can't|cannot) (stop|quit) (playing|replaying|listening to) (this|it|{s})
{s} (stuck|been stuck|living) in my head (all day|since yesterday|rent free|)
(already|i already) know (all|every one of) the words
(put|somebody put|had to put) (my|the) (whole|) (family|job|group chat|block) on (to|) (this|{a})
(turn|turned) (this|it|that) (all the way|) up
(volume|the volume) (maxed out|at 100|on max|all the way up)(, sorry neighbors|)
(windows down|sunroof open|late night drive) (and|with) (this|{s}) (playing|on|blasting)
{a} (up next|is next|next up|on the way up|about to blow)(, watch|, mark my words|, calling it now|)
(remember|don't forget) (this comment|i said it|who told you first) when {a} (blow up|go platinum|is everywhere)
(keep|please keep) (going|dropping|cooking|feeding us) {a}
(support|supporting|love seeing) (real|independent|indie|new) (artists|talent|music)(, always|, all day|)
`),
H:bank(`
(mid|this mid|kinda mid|straight mid|mid at best)
(not it|this ain't it|nah this ain't it|yeah no)
(i|) (tried|wanted) to like (it|this) but (nah|i can't|it's not hitting)
the (beat|hook|production|sample) (is|was) (carrying|doing all the work|the only good part|better than the verses)
(sound|sounds) like (everything|every other song|everybody) else (out rn|right now|on the radio|)
{his} (old|older|early) (stuff|music|songs) (was|) (better|way better|harder)
({a}|{bro}) fell off (a little|hard|after the last tape|, sorry|)
(skip|skipped|next|pass|i'll pass)
whoever (approved|mixed|mastered) this (need to be fired|owe us an apology|was sleep)
(the|this) mix (is|sound) (rough|muddy|off|terrible|bad)
(overhyped|overrated)(, sorry|, there i said it| and yall know it|)
(forgettable|i already forgot how it go|won't remember this next week)
(i don't|don't) (see|get|understand) the hype
(same|the same) flow (every|on every) (song|track)(, switch it up|)
(autotune|the autotune) (doing|is doing) (a lot|too much|overtime|all the work)
(2|3|4|5)/10(, the beat saved it| and i'm being nice| at best|)
(yall|people) (will|) (hype|like|glaze) anything (now|these days|nowadays)
{bars} (is|) (weak|lazy|basic|not there)
(could have|coulda|should have|shoulda) stayed in the (drafts|vault|studio|voice memos)
(i|) (expected|was expecting) (more|better|way more)(, kinda disappointed| from {a}|)
(not|ain't) (feeling|rocking with) (this one|it)(, maybe the next one|, sorry|)
(boring|this boring|snoozefest|put me to sleep)
(too short|too long|too repetitive)(, the hook get annoying| and nothing happen|)
(turned|cut) it off (at|after) (the first verse|30 seconds|a minute|the hook)
{a2} (ruined|killed the vibe of|didn't fit on) (it|the song)
{a} (got washed|got outrapped|got bodied) on {his} own song
(generic|basic|lazy|rushed|forced|corny|dry)
(no|zero) (replay value|effort|energy|substance)
(heard|i've heard) (this|the same song) (a hundred|a thousand|100) times (already|before|)
(where|where's) the (hook|energy|bars|effort)
(not|ain't) (adding|saving|replaying) (this|it)(, sorry|)
(the|that) hook (is|) (annoying|weak|lazy|trash|repetitive)
(nah|no|nope)(, i'm good|, i'll pass|, back to my playlist|)
(trash|this trash|straight trash|garbage|not good|wack|this wack)
(unfollowed|unsubscribing|muting this page) (if yall keep posting (this|stuff like this)|)
(who|who is) (listening to|asking for|playing) this
(tiktok|made for tiktok|15 second tiktok) (music|song|rap)
(one|1) (listen|play) (was|is) enough (for me|)
(wanted|tried) to (support|rock with it) but (it's|this is) (rough|not good|a no for me)
`),
S:bank(`
(unpopular opinion|hot take|might be a hot take)(:|,) (this|{a}) (better than|clearing|clears) (half|most of|everything on) (the charts|the radio|the industry) (rn|right now|)
{a} (is|) better than (your|yall) (favorite|fav) {rapper}(, argue with the wall| and it's not close|, idc|)
if (a big artist|a major label artist|somebody famous) dropped this (yall|it) would (call it a classic|be number 1|be everywhere)
(the|) industry (don't|doesn't) want (this type of|real) music (to win|blowing up)
(indie|independent|underground) artists (are|been) (outdoing|outworking|cooking) the (majors|mainstream|signed ones) (rn|right now|all year|)
(nobody|no one) (ready for|wanna have) (this|that) conversation but {a} (is top 5 this year|got the best drop this month|is better than who yall hype)
(be honest|be fr|real talk)(,|) (would|will) (you|yall) (still|even) (listen to|play) this (in a month|next year|next week)
(this|{s}) (is|) good but (it's|) not (replay|classic) good(, relax|, yall doing too much|)
(the|) comments (glazing|are glazing) (too much|crazy|hard)(, it's a 6|, it's just ok|, relax|)
(yall|people) only (like|listen to|support) what (tiktok|the algorithm|the blogs) (tell|tells) (you|yall|them) to
(who said|and they said) {genre} (is|was) dead
(better|harder) than (anything|everything) (that dropped|out) this (week|month|friday)(, and it's not close|, don't @ me|)
(a label|the label|a deal) (would|will|gonna) (ruin|water down|mess up) {his} sound(, stay independent|, watch|)
(stay|please stay) independent(, don't sign| {a}|, don't let them change you|)
(top|easy top) (3|5|10) (drop|release|song) (this|of the) (month|year)(, who else you got|, fight me|)
(which|what) (song|drop) (is|) better, this or the last one
(am i|i'm) the only one (who|that) (think|thinks) (this|{s}) (is|) (just ok|kinda mid|better than the last one|{his} best)
{a} (carried|carrying|is carrying) (the whole scene|the underground|{his} whole city|{his} city|the whole state) (rn|right now|on {his} back|)
(radio|the radio) (would never|won't|too scared to) play (this|real music like this)
(this|{s}) (>|over|clears) (whatever|anything) (is|) number 1 (rn|right now)
(overrated or underrated|underrated or overrated|hit or miss|classic or mid|W or L)(?| yall|, be honest|)
(the|that) (first|second) verse (is|was) better than the (whole song|hook|rest of it)(, i said it|)
(yall|people) (sleep|sleeping|been sleeping) on {a} (on purpose|and it's weird|because {he} not signed|)
(if|when) {a} (blow up|go mainstream|sign) (yall|the same people) (gonna|will) (act like yall was here|say {he} changed|switch up)
(this|{s}) (should|would) (be|have been) (bigger|a hit|number 1) (with|if it had) (a real push|a budget|a feature|promo)
(paid|bought|fake) (comments|views|streams)(?|, be honest|, i see yall|)
(streams|numbers|views) (don't|do not) (mean|equal) (talent|good music)(, and this proves it|)
`),
F:bank(`
(my|the) (speakers|headphones|airpods|car speakers) (filed a complaint|need a break|are tired|called the police)
(played|been playing) this so much my (phone|neighbors|mom|dog) (know the words|asked me to stop|filed a report|started rapping)
(i|) (made the stank face|scrunched my face) so hard (i pulled a muscle|my face got stuck|i scared my cat)
(me|) (acting like|pretending) i (been|was) a fan (since day one|for years|from the start) after one song
(i|) (was|) supposed to be (working|studying|sleep|cleaning) (and|but) now (i'm|) (on my 10th replay|doing a concert in my room|performing in the mirror)
my (boss|teacher|mom|coworker) (asking|asked) why (i'm|) (nodding|bopping|mean mugging) (at my desk|in the meeting|at dinner|in class)
(the|this) beat (owe|owes) me (a new neck|neck surgery|a chiropractor visit)
(not|) me {rap} (this|every word) like (i wrote it|it's my song|i paid for the studio time)
(don't even got a car and this got me speeding|don't even got opps and this got me looking over my shoulder|broke as hell and this got me feeling rich|i work at 6am why am i hype rn)
(somebody|someone) (check on|call) the (beat|booth|studio|mic)(, {bro} (murdered|killed) it|, it's not breathing|)
(rip|pray for) the (beat|booth|mic|replay button)
(walked|came) in here for one (song|listen) and (left|leaving) (a fan|with a new favorite artist)
(gym|the gym) (playlist|pr) (just|) (got|went) (dangerous|up 50 pounds|crazy)
(my|) (uber driver|barber|cashier|mailman) (asked|asking) (me|) (what song this is|who this is|to turn it up)
(i|) (ran|almost ran) a red light (to|listening to) (this|{s})
(got|caught) (a|) (speeding ticket|noise complaint) (because of|behind|thanks to) (this|{s}|{a})
(why|) (did|) i (just|) (hit|mean mug|stank face) (my|the) (steering wheel|mirror|microwave|fridge)
(my|) (replay|repeat) button (need|needs|filed for|asking for) (a vacation|workers comp|a raise|help)
(phone|battery|my phone) at (1|2|3)% and i'm (still|) (playing|replaying) (this|it)
(told|i told) (myself|my girl|my mom) one more (time|listen|play) (an hour|30 minutes|5 replays) ago
`),
N:bank(`
(who|who's) (produced|made) (this|the beat)
(when|when's) the (album|tape|video|ep|next one) (dropping|coming|out)
(is this|this) on (spotify|apple music|all platforms|streaming) (yet|)
(where|where's) {a} from
(what|what's) the (sample|song they sampled)
(rate|rating) (it|this)(:|) (7|8|8.5|9|6.5|7.5)/10(, the hook carried|, solid|, pretty good|)
first time (hearing|listening to) {a}(, what should i check next|, not bad|, where do i start|)
(anybody|anyone|who) (got|know) the (lyrics|name of the producer)
(here|came) (from|because of) (the ig post|the story|the reel|RAPAECHELON)
(tour|a tour|show dates) (when|soon)
(need|drop) (a|the) (clean version|instrumental|lyric video|visualizer)
(what|which) (city|state) (is {a} from|{a} rep|{a} out of)
(how long|how many years) (has|) {a} been ({rap}|making music|doing this|at it)
(growing|it's growing|this one growing) on me
(second|2nd) listen (hit|hits) (harder|different|better)
(not bad|decent|solid|pretty good|aight)(, i can hear the potential|, i'd listen again|, not my style but ok|)
(what|which) (other|) (songs|song) (by {a}|) should i (check|listen to|start with)
(is|) {a} (signed|independent|on a label)(?| or independent| yet|)
(who|anybody|anyone) (else|) (found|here from|heard) (this|{a}) (on|from|through) (the charts|the indie charts|rapaechelon)
(what|what's) (the|) (name of the|) (song|track) (at the start|again|called)
(link|full song|where can i hear the full thing)(?| please|)
(does|do) {a} (got|have) (more|any more) (songs|music) like this
(interesting|different|ok i hear it|i can see it|not what i expected)
`)};
T.rnb={
L:bank(`
(vocals|the vocals|harmonies|the harmonies|the runs|the falsetto|background vocals|the bridge) (is|was) (crazy|so smooth|beautiful|butter|insane|giving 90s|everything)
(real|grown|actual) r&b (is|) back
(this|{s}) (is|) for the (lovers|late night drives|slow jam playlist|texts you shouldn't send)
(about|bout|finna) to (text|call) (my ex|somebody i shouldn't)(, thanks {a}|, smh|)
(candles lit|lights low|wine poured)(,|) (this on|{s} playing|mood set)
(voice|that voice|the tone) (like|is) (butter|silk|honey|velvet)
(baby making|slow dance|two step|cookout|sunday morning) music
(r&b|rnb) (ain't|is not|was never) dead(, {a} proved it| and this proof|)
{a} (can|could) (really|actually) sing(, no autotune needed|, that's rare now|)
(this|{s}) (feel|feels|sound|sounds) like (2003|the 90s|a summer night|falling in love|a hug)
(need|i need) (somebody|a boo|a man|a girl) (to|so i can) (play|dedicate|send) this (for|to)
(put|putting) (this|{s}) on (the|my) (love|late night|in my feelings|shower) playlist
`),
H:bank(`
(too much|all) autotune(, where the real singing| for r&b|)
(r&b|rnb) singers (don't|don't even) sing (no more|anymore)(, they talk|)
(whining|whispering|mumbling) (ain't|is not) singing
(every r&b song sound|every r&b song sounds|all r&b songs sound) the same now
(no|zero) (soul|feeling|emotion|range) (in it|at all|)
(toxic|same toxic) (r&b|lyrics) (again|is played out|getting old)
`),
F:bank(`
(i|) don't even (have|got) (a man|a girl|nobody|an ex) (and|but) (i'm|) (heartbroken|in my feelings|crying in the car) (now|rn|)
(single|been single) for (2|3|5) years (and|) (singing|sang) this like (i just got left|somebody did me wrong)
(staring|looking) out the (window|car window) like (i'm|) in a (music video|movie)
(almost|about to) (texted|text) (my ex|him|her)(, somebody take my phone|, pray for me|)
(singing|sang) this in the shower like (i got a deal|it's my concert|the neighbors paid for tickets)
`)};
T.album={
L:bank(`
no skips
(what's|what) (yall|everybody) (top 3|favorite track|favorite song) (off|on|from) (it|the album|the tape)
(album|project|tape) of the year (contender|candidate|so far|)
(front to back|top to bottom|all the way through)(, no skips|, played it twice|, classic|)
(the|) (intro|outro|features|rollout|cover art|tracklist|sequencing) (is|was) (crazy|perfect|hard|fire)
(played|ran) (it|the whole thing) (twice|3 times|all night|on the way to work) (already|)
(every|each) (song|track) (is|) (a hit|a vibe|a movie|better than the last)
(worth|was worth) the wait
`),
H:bank(`
(too many|way too many) (songs|tracks|features|fillers)
(half|most) (of|) the (album|tape) (is|) filler
(3|4|two|three) good songs and the rest (is|) (skips|filler|mid)
(should|coulda|could) (have|) been an ep
(the|) singles (was|were) better than the (album|whole project)
(rushed|felt rushed|sound unfinished|needed more time)
`),
S:bank(`
(better|worse) than (the|{his}) last (album|project|tape)(, easy|, and it's not close|, don't @ me|)
(classic|instant classic)(?| or too early to say| or yall just excited|)
(first|opening) week (numbers|sales) (gonna|about to) (be low and it's still better than the charts|surprise people|tell the truth)
(deluxe|the deluxe) (gonna|about to|will) (ruin|save|fix) it
(nobody|no one) (will|gonna) (talk about|remember|play) (this|it) in (a|two) (month|months)(, watch|)
`)};
T.video={
L:bank(`
(visuals|the visuals|the video|the cinematography|the editing|the color grading|the transitions|the director) (is|was) (crazy|clean|cinematic|on point|movie quality|insane)
(who|who's) (shot|directed|edited) (this|the video)(, they went crazy|, give them a raise|)
(budget|the budget) (was|is) (crazy|looking right|well spent)
(video|the video) (match|matches|fit|fits) the song (perfect|perfectly|so well)
(this|the video) (look|looks) like a (movie|film|short film)
(the|that) (fit|outfit|outfits|location|scene at the end|car) (is|was) (hard|crazy|fire|clean)
`),
H:bank(`
(video|the video) (is|was|look) (low budget|boring|doing too much)
(same|the same) (video|shots|rented car|mansion) (every|as every) (rapper|video)
(song|the song) (is|) better without the video
(nothing|nothing really) happen in the (video|whole video)
`),
F:bank(`
the (dude|guy|one guy|girl) in the (back|background) (doing too much|having the time of they life|don't know the words|stole the video)
(somebody|someone) (in|from) the video (definitely|) (don't|doesn't) know (why they there|the words|{a})
(extras|the extras) (understood|didn't understand) the assignment
`)};
/* ------------------------------------------------ NEWS */
T.general={
L:bank(`
(love|gotta love|respect) (to see it|that|this)
(good|great) for {a}(, well deserved|)
{a} (stay|been|keep) winning
(well deserved|deserved|long overdue|about time)
(W|big W|huge W) (for {a}|move|news|)
(this|) made my day
(needed|we needed) (some|) good news (today|for once|)
(proud of|happy for|so happy for) {a}
{a} (been|been really) (working|grinding|putting in work) (for this|)
(salute|respect|congrats|shoutout) (to|) {a}
(big|huge|major) (move|moves|news|if true)
(this|that) (is|) (how you do it|what i like to see|good for the culture)
(can't|cannot) (be mad at|hate on) (that|this|{a})
(that's|this is) (dope|fire|hard|big|major)
(let's|lets) go {a}
keep (going|winning|doing your thing) {a}
(inspiring|motivation|this is motivation|love this|love this for {a})
(more|we need more) (of this|stories like this|positive news)
(real|good|great) news (for once|finally|)(, love it|)
(big|huge|major) (congrats|congratulations|respect|salute) (to|) {a}
{a} (deserve|earned|worked for) (this|that|every bit of it|all of it)
(been|i been) (rooting|pulling) for {a} (since day one|for years|the whole time|)
(this|that) (is|) what (hard work|consistency|staying down|patience) (look|looks) like
(happy|glad|love) to see {a} (winning|doing good|eating|getting {his} flowers)
(give|giving) {a} {his} flowers
(another|one more) (win|W|one) for (the culture|{a}|hip hop|us)
(haters|the haters) (real|) (quiet|mad|sick) (right now|rn|today)
(nothing|ain't nothing) but (respect|love) for {a}
(legendary|boss|power|grown|smart) (move|moves|behavior)
(this|) (put|puts) a smile on my face
(yes|yesss|yessir|let's gooo|ayeee|okayyy|period)
(that's|this is) (how|why) {a} (stay|been|still) (relevant|on top|winning|here)
(good|great|positive) (energy|vibes|news) (only|today|on the timeline|)
`),
H:bank(`
(who|who even) (cares|asked)
(slow|must be a slow) news day
(this|) (is|) not news
(why|how) is this (news|on my feed|a headline)
(nobody|no one) (asked|cares|was wondering)
(L|big L|huge L) (for {a}|move|take|)
{a} (doing|always doing|stay doing) (too much|the most|anything for attention)
(clout|attention) (chasing|stunt|move)(, next| again|)
(tired|sick) of (hearing about|seeing) {a}
(clickbait|click bait)(, as usual| again| title|)
(and|ok and|so)(?| what| who cares)
(next|moving on|scrolling|keep scrolling)
{a} (is|been|) (irrelevant|washed|doing anything to stay relevant|trying too hard)
(don't|do not) care(, next|, never did|, sorry|)
`),
S:bank(`
(pr|PR) (stunt|move|team working overtime)(, something must be dropping soon|)
(timing|the timing) (is|) (crazy|suspicious|interesting|convenient)
(there's|) (more|way more) to (this|the) story(, watch|, trust|)
(they|blogs|the media) (not|never) (telling|gonna tell) (the|you the) (whole|full|real) story
(distraction|it's a distraction|this a distraction)(, what are they hiding|, from what tho|)
if (it was|this was) (anybody|anyone|somebody) else (yall|people|the internet) would (be outraged|lose it|say something different)
(waiting|wait) (for|on) (the other side|both sides|{a}'s side) (of the story|) (before i say anything|first|)
(yall|people) (believe|will believe) (anything|everything) (the blogs|the internet|a headline) (say|tell you)
(unpopular opinion|hot take): {a} (did nothing wrong|is right|was right|not wrong)
(the|) internet (gonna|will) (forget|move on from) this (in a week|in two days|by friday|by tomorrow)
(both|everybody|all of them) (wrong|doing too much)(, idc| here|)
{a} (right or wrong|wrong or right|in the right or nah)(?|, be honest|, pick a side)
(follow|always follow) the money
(somebody|someone) (getting|is getting|got) paid (for|off|behind) this
(yall|people) (was|were) (just|) (hating on|canceling|dragging) {a} (last week|last month|yesterday)(, now look|)
(agree|agree or disagree|W or L|thoughts)(?|, be honest|)
`),
F:bank(`
(i|) was (just|) minding my business (and|then) this (hit|popped up on) my (feed|timeline)
(not|) me reading (this|the comments) (at work|at 3am|instead of working|with popcorn)
(here|came) for the comments(, not disappointed|, as always|)
(the|) comments (about|bout|finna) to be (crazy|undefeated|a movie)
(2026|this year|the internet) (is|) (undefeated|wild|not real|a movie)
(the|this) (simulation|timeline) (is|) (glitching|broken|crazy) (again|)
(grabbing|getting|where's) (my|the) popcorn
(you|yall) can't make this (up|stuff up)
(never|not) a (dull|boring) (day|moment) (on here|on the internet|in hip hop|)
(my|) (2026|) bingo card (did not|didn't) have this (one|)
(logging|i'm logging) off (for the day|after this|, i've seen enough)
(what|what a) (time|year|week) to be (alive|online|on this app)
`),
N:bank(`
(wait|hold up|hold on) (what|is this real|for real)
(source|what's the source|is this confirmed|where the proof)(?|)
(when|where) did (this|that) happen
(link|full story|the rest of the story)(?| where| please)
(what|what did) (i|we) miss
(somebody|someone|can somebody) (explain|fill me in|catch me up)
(is this|this) (real|true|fake|old)(?|)
(context|need context|more context please)
(wow|damn|dang|welp|well|yikes|whew|oh|hmm|interesting)
(what|wait what) (did|) {a} (say|do|said|did) (now|this time|)
(first i'm hearing|first time hearing|just now hearing) (of|about) this
`)};
T.beef={
L:bank(`
(this|) (about|bout|finna) to (be|get) (good|crazy|ugly|interesting)
(hip hop|rap) (needed|need) this(, competition is good|)
(need|we need|drop) (the|a) (response|diss|diss track) (asap|tonight|by friday|now)
{a} (not|ain't) (playing|scared|backing down|the one to play with)
(i'm|) (team|riding with|with) {a} (on this one|all day|, idc|)
(real|pure) (sport|competition|hip hop)(, keep it on wax|, love to see it|)
(keep|as long as they keep) it on wax
{a} (said|really said) what (needed to be said|everybody was thinking|nobody else would)
(competition|a little competition|smoke) (is|) (good|healthy) for (the|) (culture|game|music)
{a} (got|has|winning) this (one|)(, easy|, not close|)
(been|i been) waiting (on|for) (somebody|someone|{a}) to (say|speak on) (it|this|something)
(stand|standing) on (business|it|what {he} said)
(bars|the bars|pens|the pen game) (about|bout) to (be|get) (crazy|sharp|serious)
`),
H:bank(`
(grown|two grown) (men|people|adults) (arguing|beefing|going back and forth) (on the internet|online|over nothing|on ig)
(internet|twitter|ig) (beef|tough guys) (is|) (corny|lame|so lame|tired)
(put|just put) (it|that energy) (in|into) the (music|booth|studio)
(nobody|no one) (gonna|is gonna) do (nothing|anything)(, as usual|, watch|, it's all talk|)
(this|the) (beef|whole thing) (is|feel|feels) (fake|staged|forced|scripted)
(both|they both) (need|should) (to|) (grow up|log off|drop music instead)
{a} (not|ain't) (winning|ready for) (this one|that smoke)
(all|it's all|just) (talk|cap|for clicks|promo)
(nobody|no one) (asked for|care about|need) (this|another) (beef|back and forth)
(lame|corny|childish|embarrassing|weird) (behavior|on both sides|all around|)
(too old|way too old) (for|to be doing) (this|all this)
(this|that) (how|is how) (people get|somebody gets) hurt(, chill|, leave it alone|)
{a} (should|shoulda|need to) (stay|stayed|just stay) quiet
`),
S:bank(`
(staged|fake beef|promo run)(, they both got music coming|, watch them drop a song together|)
(who|who's) (winning|won|taking this)(, be honest| and why| so far|)
{a} (would get|getting|got) (cooked|washed|bodied) (in a real battle|on a track|bar for bar|)
{a} (started|been wanting|wanted) (it|this|this smoke)
(the|) other side (been|is|was) (quiet|real quiet|silent)(, interesting| tho|)
(pick|picking|choose) a side(, no fence sitting|, no both sides| yall|)
(lyrically|bar for bar|on a track) (it's|) not (close|even close|a contest)
(this|it) (won't|not gonna) end (well|good|on wax)(, watch|, sadly|)
{a} (been|was) (right|telling the truth) (the whole time|from the start|and yall hated)
(yall|people) (only|) (picking|pick) (a side|sides) (based on|off) (who (they|yall) like|popularity)(, not facts|)
(ghostwriters|the ghostwriters|the writers) (about|bout) to (be busy|clock in|eat)
(the|) fans (more|are more) (invested|into it|mad) than (them|the artists)
(somebody|one of them) (lying|is lying|capping)(, and i think i know who|)
(real|actual) beef or (business|marketing|promo)(?|)
`),
F:bank(`
(popcorn|my popcorn) (ready|loaded|in the microwave)
(the|) group chat (is|bout to be|about to be) (on fire|going crazy|lit) (tonight|rn|)
(somebody|someone) (take|hide) (the|they) (phones|phone|wifi)
(they|) (typing|typed) (paragraphs|essays|all that) (and|but) won't (drop|make) a (song|diss)
(i|) (love|live for) the mess(, sorry|, not gonna lie|)
(refreshing|i keep refreshing) (the|my) (feed|page|timeline) (every 5 minutes|for the response|like it's my job)
(not|) (getting|doing) (any|no) work (done|) today (because of this|)
(the|) (notes app|ig story|caption) (about|bout) to (work overtime|get busy)
(somebody's|they) (publicist|pr team|manager) (is stressed|crying|need a raise|just quit)
`),
N:bank(`
(what|wait what) (started|is) (this|the beef|it) (even|) (about|)
who (said|started) (what|it) (first|)
(timeline|recap|backstory)(?| anybody| please)
(did|has) {a} (respond|responded|say anything|said anything) (yet|)
(what|what did) {a} (say|said|actually say)
(when|where) did (this|all this|it) (start|happen)
(they|) (was|were) (just|) (cool|friends|working together) (last year|last month|not long ago)(, what happened|)
(is|) (there|) a (diss|song|response) (out|coming|yet)
`)};
T.legal={
L:bank(`
(free|free up) {a}
(prayers|praying) (for|up for) {a} and (the|{his}) family
(innocent|everybody innocent) (until|til) proven guilty
(hope|hoping) (it work out|the truth come out|{a} come home soon)
(the|) (system|feds|courts) (been|always|stay) (targeting|after|on) (rappers|us|our people)
(they|) (using|use) (lyrics|rap lyrics|music) (as evidence|in court) (again|and that's crazy|)
(keep|keeping) {a} in (my|our) prayers
(stay|hold) (strong|ya head|your head up) {a}
(they|) (don't|never) want to see (us|{a}|a rapper) (win|winning|doing good)
(get|hope {he} got|{he} need) a good lawyer
(not|i'm not) (believing|buying) (it|this) (until|til) (i see proof|the facts come out|the trial)
(home|{he} be home|{a} be home) soon
(too much|so much) talent to (be|go out) (like this|locked up|sitting in a cell)
`),
H:bank(`
(play|do) (stupid|dumb) games(,|) (win|get) (stupid|dumb) prizes
(do|if you do) the crime(,|) (do|gotta do) the time
(all|had all) that money and (still|) (in the streets|doing this|can't stay out the way|moving like that)
(no|zero) sympathy
(lock|locked) {him} up(, good|, finally|)
(another|yet another) (one|rapper) (throwing|threw) (it all|everything) away
(leave|left) the streets alone (when|once) (you|the) (get the money|got a deal|money come)
(crashing|crash) out (for|over) (nothing|what|what tho)
(they|you) never learn
(saw|we all saw) (this|that) coming
(stop|quit) (defending|making excuses for) (grown men|these rappers|criminals)
(had|got) (every chance|all the chances|every opportunity) to (do right|change|walk away) and (still chose this|threw it away|did this anyway)
(that's|) what happen when you (keep|) (hang|hanging) (with|around) the same (people|crowd)
(career|whole career) (over|gone|done)(, for what|, sad|)
(think|imagine|what) about the (victims|victim|family|kids)(, nobody talking about them|)
`),
S:bank(`
(somebody|someone) (told|talked|snitched|been talking)(, watch|, trust me|, 100%|)
(a|another) (celebrity|rich person|famous person) would (get|have got) (probation|a slap on the wrist|house arrest)
(they|) (been|was) (building|watching|on) this (case|) (for years|for a minute|a long time)
(set up|this a setup|sound like a setup)
(blogs|the media|they) only post (rappers|us) (in handcuffs|when it's bad news)
{a} guilty and yall know it
(the|) (lawyer|lawyers|legal team) (about|bout) to (get paid|eat|earn that check)
(rico|RICO|conspiracy) (season|charges) (again|is back|never ended)
(who|who's) (really|) (benefit|benefits|winning) from (this|{him} being gone|this case)
(yall|people) (defend|will defend) (anybody|anything) (who|that) (can rap|make music|got a hit)
(if|bet if) {he} (wasn't|was not) (famous|a rapper) (nobody would care|this wouldn't even be news|{he} would be home already)
(guilty or innocent|innocent or guilty)(?|, what yall think|, be honest)
(the|) (label|industry|people around {him}) (knew|know|been knew) (about this|what was going on|)
(separate|can you separate) the (art|music) from the (artist|person)(?|)
(still|i'm still) (playing|listening to|streaming) (the|{his}) music(, idc|, sorry|, judge me|)
(done|i'm done) (listening to|supporting|streaming) {a}(, can't do it|, sorry|)
`),
F:bank(`
(the|{his}) lawyer (reading|seeing|watching) this like (here we go again|i need a raise|not again)
(lawyer|the lawyer) said (don't post|stay off live|stay off the internet) and (look|here we are)
(the|) (lawyer|bondsman|bail bondsman) (on speed dial|know {him} by name|got a new boat coming)
(court|the court) (fit|outfit) (bout|about) to (go viral|be crazy|be the real story)
(judge|the judge) (bout|about) to be (tired|sick) of (seeing|hearing about) (rappers|{a})
(not|) (again|another one|this again)
the (group chat|barbershop|comments) (about|bout) to (be a courtroom|play lawyer|argue all day)
(everybody|everyone) (in|on) (here|the comments) (a|is a) (lawyer|judge|detective) (now|today|all of a sudden)
(the|) comments (section|) (law school|law degree) (class of 2026|graduates|in session)
`),
N:bank(`
(what|what are|what's) the charges
(how much|what's) (the|{his}) (bond|bail)
(when|when's) (the|) (court date|trial|sentencing|next hearing)
(how|how much) (long|time) (is|) {he} (facing|looking at)
(is|was) (it|this) (state|federal|a fed case)
(allegedly|alleged|keyword: allegedly)
(what|wait what) (happened|did {he} do|is {he} accused of)
(is|) {he} (out|home|still locked up|in custody) (yet|)
(where|what city|what county) (did this happen|is the case|was this)
(damn|wow|smh|dang|sad|crazy)
`)};
/* tragic news: respectful only, every tone setting lands here */
T.rip={
L:bank(`
(rip|rest in peace|rest easy|rest up|rest well|rest in power|RIP) {a}
(prayers|praying|condolences|sending love|sending prayers) (to|for) (the|{his}) (family|loved ones|family and friends|kids)
(gone|taken|left us) (too|way too) (soon|early|young)
(this|this one|that one) (hurt|hurts|hit different|hit hard|stings)
(damn|dang|man|wow|no|not {a})
(can't believe it|can't believe this|this don't feel real|doesn't feel real|still don't believe it)
(thank you|thanks) for the music(, {a}|, legend|)
(legend|a real one|one of a kind|a good soul)(, rest easy|, gone too soon|, never forgotten|)
{his} music (got|helped|carried) me through (a lot|some dark times|high school|hard times|so much)
(playing|running|bumping) {his} (music|songs|catalog) all (day|week|night)
long live {a}
(fly|fly high|sleep well) {a}
(we|) (lost|losing) (another|a) (one|legend|good one|real one)
(give|gotta give) (people|them|folks) (they|their) flowers while (they|they're) (here|still here)
(tomorrow|life) (is|) (not|ain't) promised(, hug your people|, tell your people you love them|)
(heartbreaking|so sad|tragic|devastating)(, prayers up| news|, no words|)
(check|checking) on (your|ya|yall) (people|friends|loved ones)
(heart|my heart) (goes out|go out) to (the|{his}) (family|kids|mom|loved ones)
(the|) (city|culture|game) (lost|just lost) a (real one|legend|voice)
(too many|we keep losing) (legends|artists|young people|good ones)(, this has to stop|, gone too soon|)
(no|i got no|speechless|at a loss for) words
(remember|still remember) (when|the first time) i heard {his} (music|first song|voice)
(🙏|🙏🙏|🕊️|💔|🙏🕊️|💔🙏|🕊️🕊️)
(never|will never be) forgotten
(legacy|the legacy|{his} legacy) (live|lives) (on|forever)
(prayers up|praying for everybody|praying for the family|keep the family in prayer)
(this|) (can't|cannot) be (real|true)
(i feel sick|my stomach dropped|my heart dropped|heart dropped)( reading this| seeing this|)
(respect|nothing but respect|all love) (for|to) {a}(, always|, forever|)
(grew up|grew up listening|been listening) (on|to) {a}(, this hurt| since a kid|, this one personal|)
(let|please let) the family (grieve|mourn|have privacy|have peace)
(one|1) of the (greats|good ones|realest|best to do it)
(saw|seen) {him} (live|perform) (once|years ago|last year)(, will never forget it|, so glad i did|)
(hug|call|text) (your|ya) (people|family|friends|mom) (today|tonight|while you can)
(still|i'm still) (in shock|processing this|can't process this)
(lost|we lost) a (great one|good one|giant|legend) (today|)
(praying|prayers) for (peace|comfort|strength) for (the|{his}) (family|loved ones)
the (music|songs|verses) (will|gonna) (live|play) forever
(watching|been watching) (old|{his} old) (interviews|videos|performances) all (day|night)
(God|Lord) (bless|be with|comfort|cover) (the|{his}) (family|kids|mother|loved ones)
(rest|sleep) (peacefully|in paradise|in heaven), {a}
one of my (favorites|favorite artists)(, this hurt|, rest easy|)
(gone|you're gone) but (never|not) forgotten
(this|) (year|week|month) (has been|been) (rough|heavy|too much)
(hold|hug) (your|ya) (loved ones|people|family) (close|tight|a little tighter) (tonight|today|)
(sad|a sad|terrible|dark) day (for|in) (hip hop|music|the culture|the city)
(wish|i wish) (this|it) (wasn't|was not) (true|real)
{a} (meant|mean) (a lot|so much|the world) to (me|the culture|so many people|the city)
(thinking|been thinking) (of|about) (the|{his}) (family|kids|loved ones) (today|tonight|all day|)
`)};
T.hurt={
L:bank(`
(prayers|praying|sending prayers) (up|) for {a}
(hope|hoping|praying) {he} (pull|make it|pull through|recover) (through|) (soon|fast|)
(speedy|quick|full) recovery (to|for) {a}
(this|the) world (is|) (crazy|getting crazy|sick|not safe)
(stay|keep) (safe|your head on a swivel|prayed up) (out there|yall|everybody)
(damn|dang|man|wow|smh|not again)
(praying|prayers) for (everybody|everyone) involved
(hope|hoping) (everybody|everyone|{a}) (is|) (ok|okay|alright|good)
(this|) (is|) (so sad|sad|scary|heartbreaking|terrible)(, prayers up|)
(protect|God protect|Lord protect) {a}
(praying|prayers) for {his} (family|loved ones|people|kids)
(sending|send) (love|strength|healing|good energy) (to|) {a}
(too|way too) (much|many) (violence|of this|going on)(, it has to stop|)
(glad|thank God|thankful) (it's|it was|) not worse
(get|hope {he} get) well soon(, {a}|)
(🙏|🙏🙏|🙏🙏🙏|🙏💯|❤️🙏)
(any|is there an) update(s|)(?| on {a}| on how {he} doing)
(what|wait what) happened
(keeping|keep) {a} in (my|our) prayers
(pull through|pulling for you|we pulling for you) {a}
({he} strong|{he} a fighter|{he} a soldier)(, {he} got this|, {he} will be back|)
(everybody|we all) (praying|pulling|rooting) for {a}
(hope|hoping|praying) (it's|it is) not (serious|as bad as it sound|as bad as they saying)
(this|that) (is|) (scary|terrifying|sad)(, hope {he} ok|, prayers|)
(everybody|we) need to (stay safe|be careful|move smart) (out here|these days|)
(God|Lord) (got|watch over|cover|be with) {a}
(healing|strength|peace) (and prayers|) (to|for) {a} and {his} (family|loved ones|people)
(come|coming) back (stronger|soon|healthy), {a}
(health|your health|safety) (first|come first|over everything)(, {a}|)
(just|i just) (saw|heard|read) (this|the news|about this)(, prayers up|, i'm sick|, hope {he} ok)
(not|please not) {a}
(we|the fans|the city) (love|got|need) you, {a}
(rooting|pulling|praying) for a (full|fast|speedy|quick) recovery
(thoughts|my thoughts) and prayers (to|with|for) {a}
(stay|staying) (prayed up|strong|positive), {a}
(hate|i hate) (to see|seeing|hearing) (this|news like this|stuff like this)
(let|please let) {him} (and the family|) (rest|heal|have privacy)
(hopefully|hope) (we get|there's) (good news|an update|a good update) soon
`)};
T.wild={
L:bank(`
(what|wtf|what in the world) did i just (watch|see)
(i|) (watched|ran it back|replayed) (it|this) (5|10|like 20|3) times
(this is|that's|that is) (wild|crazy|insane|nuts|unreal)
(the|) way (i|my jaw) (gasped|dropped|screamed)
(cameraman|camera man|whoever recording) (never flinched|deserve a raise|stayed calm the whole time|is the real mvp)
(i|) (can't|cannot) (look away|stop watching|believe what i just saw)
(wild|crazy|insane|unreal|chaos|madness|a movie)
(never|i've never) seen (nothing|anything) like (this|that)
(my|) (heart|jaw|soul) (dropped|left my body|stopped)
(that|this) (escalated|went left|got crazy) (quick|fast|real quick|out of nowhere)
(did not|didn't) (expect|see) (that|the ending|that coming|it to go like that)
(whew|sheesh|yooo|bruh|broooo|nah|oh nah|oh my)
(yo|bro|nah) (what|what is) (going on|happening) (here|in this video|)
(i|) (got|have) (so many|a lot of|too many) questions
(speechless|no words|i have no words|at a loss for words)
(had|i had) to (watch|see) (it|this) (twice|again|3 times) to (believe|process|understand) (it|what happened)
my (anxiety|blood pressure|heart rate) (went|shot) (through the roof|up|crazy) (watching this|)
(this|the) (video|clip) (got|has) (everything|it all|a plot twist|levels to it)
the (first|last) (5|10|few) seconds (is|was) (crazy|insane|wild|a lot)
(oh my goodness|good lord|lord have mercy|oh my days|my goodness|what in the world)
(i|) (felt|feel) (that|this) (through|thru) the (screen|phone)
(everybody|everyone) (in|on) (this|the) (video|clip) (is|was) (wild|crazy|moving different|on something)
(the|) (internet|timeline|feed) (is|) (never|not) (boring|dull|letting me rest) (today|)
(you|yall) (really|) (never|don't) know what (you|yall) (gonna|going to) see on (here|this app|this page|the internet)
(this|that) (is|was) (a lot|too much|something else|different) (to take in|for a monday|for one video|)
`),
H:bank(`
(why|why are yall) (record|recording) (instead of|and not) (helping|calling somebody|breaking it up)
(nobody|not one person) (helped|stepped in|did anything)(, just phones out|, typical|)
(people|folks) (is|are) (the problem|so embarrassing|lost|sick) (now|nowadays|)
(embarrassing|ignorant|sad|trashy)(, smh| behavior| all around|)
(stop|quit) (posting|sharing|giving attention to) (this|stuff like this)
(we|) (gotta|got to|need to) do better(, fr|, as a people|)
(this|that) (ain't|is not) (funny|entertainment|content)(, somebody could've got hurt|)
(everybody|everyone) (want|wanna) (be|go) viral (now|so bad|)
(grown|grown ass) (people|adults) (acting|out here acting) like (this|kids|that)
(the|) (world|internet|society) (is|) (doomed|lost|getting worse|cooked)
(no|zero) (home training|respect|shame|common sense)
(disgusting|disturbing|sickening|pathetic|shameful)
`),
S:bank(`
(staged|fake|scripted|this staged)(, look how nobody reacted|, 100%| for views|)
(need|show|where's) the (full|whole|unedited) (video|clip)(, this is cut|, what happened before|)
(what|show what) happened (before|right before) (the camera|they started recording|this) (tho|)
(i|) (bet|guarantee) (somebody|the one recording) (started|provoked|instigated) it
(both|everybody|all of them) (wrong|was wrong|in the wrong)(, idc| here|, period|)
(somebody|someone) (deserved that|had that coming|asked for it)
(somebody|someone) (going|is going|bout to go) to jail (over|for) (this|a video)
(this|that) (how|is how) (people|you) (get|end up) (hurt|locked up|on the news)
(who|who's) (wrong|in the wrong|at fault) (here|)(?|, be honest|, i'll wait|)
(yall|people) (only|) (mad|care) (because|cause) (it's on camera|it went viral|somebody recorded)
(nobody|no one) (is|was) (innocent|right) (in this|here)
(i|) (would|woulda|would have) (done|did) (the same|the same thing|worse)(, sorry|, idc|)
(right or wrong|justified or doing too much|wrong or nah)(?|, be honest)
(charges|lawsuit|a lawsuit) (coming|incoming|loading)(, watch|)
`),
F:bank(`
(i|) (would|woulda|would have) been (gone|out the door|in my car|home) (immediately|so fast|in 2 seconds|before it started)
(i|) (shouldn't|should not) (be laughing|have laughed) but (i am|i did|here i am)
(nah|bro|yo) (i'm|) (crying|weak|done|dead|hollering|screaming)
the (ending|end|last part|last second) (got|took|sent) me (out|)
the (audio|sound|commentary|person recording) (is|was) (sending me|the best part|killing me|taking me out)
(sent|sending) (this|it) to (the group chat|everybody|my whole family|my cousin) (rn|immediately|)
(the|) (person|one) (recording|filming) (laughing|giggling|commentating) (is|was|) (sending me|the best part|me)
(me|) (watching|seeing) this (from|at) (a safe distance|my couch|work) like (i was there|i'm involved|it's a movie)
(i|) (need|needed) (a|the) (slow motion|instant|) replay
(this|) (better|is better) than (cable|netflix|anything on tv)
my (nosy|nosey) (self|behind) (would|woulda|would have) (stayed|been) (right there|front row|recording too)
(i|) was (eating|in bed|at work|half asleep) (and|when) this (woke me all the way up|had me sit up|made me drop my food)
(who|who else) (watched|replayed) (it|this) (for|just for) the (ending|reaction|last part)
(free|quality|premium) entertainment(, no subscription needed|, thank you internet|)
(i|) (gasped|screamed|yelled) (so|) loud (my|the) (dog|neighbors|whole house|coworkers) (heard|looked at me|jumped)
`),
N:bank(`
(where|what city|what state) (is|was) this
(when|what day) (did this happen|was this)
(what|wait what) happened (after|next|before)
(is everybody|are they|is everyone) (ok|okay|good|alright)
(context|what's the context|backstory)(?| please| anybody)
(part 2|pt 2|full video|the rest)(?| where| please)
(is this|this) (real|old|recent|from today)(?|)
(what|what's) (the|) (story|situation) (here|behind this|)
(did|has) (anybody|anyone|somebody) (get|got|been) (arrested|hurt|charged)
(who|who's) (is|) (that|the person recording|involved)
(how|how did) (this|it|that) (even|) (start|happen)
(anybody|anyone) (know|got) (the|) (full story|what happened|more info)
(why|why was) (nobody|no one) (stopping|stopped) (it|this)
(what|what was) (the|) (reason|point|argument) (for all this|about|)
(any|is there an) (update|follow up)(?| on this| yet)
`)};
T.funnyvid={
L:bank(`
(i'm|i am|) (crying|weak|dead|done|hollering|in tears|on the floor|screaming)
(i|) can't (breathe|stop laughing|stop watching|with this page)
(funniest|the funniest) (thing|video|clip) (i|i've) seen (all|this) (day|week|month|year)
(this|) (made|just made) my (day|whole day|week|night)
(watched|replayed) (it|this) (10|5|like 30|too many) times (and|) (it's|) still (funny|laughing|crying)
(sent|sending|sharing) (this|it) to (the group chat|my whole family|everybody|my sister|my brother|my bestie)
the (timing|delivery|facial expression|face|audio|caption|ending|pause|commitment) (is|was) (perfect|everything|sending me|taking me out|killing me|gold)
(comedy|pure comedy|instant classic|hall of fame clip|certified classic)
whoever (made|posted|edited|recorded) this (need|deserve) (a raise|an award|an oscar|they flowers)
(the|) internet (is|) undefeated
(i|) (needed|really needed) (this|that) laugh (today|tonight|)
(stop|stoppp|bro stop|nah stop)(, i can't|)
(😭|💀|😂|🤣|😭😭😭|💀💀💀|😂😂😂|😭💀|🤣🤣)
(lmao|lmaooo|lmfao|loool|dead|deceased|i'm gone|gone|hollering|crying|weak|i'm weak|screaming)
(tears|actual tears|real tears)(, i'm crying|, can't breathe|)
(who|who else) (watched|replayed) (this|it) more than (once|5 times|10 times)
this (never get|will never get|never gets|don't get) old
(saved|saving|downloaded) (this|it) (for|to my) (later|a bad day|favorites|camera roll)
(the|) comments (just|are just) as funny (as the video|)
`),
H:bank(`
(not|ain't|wasn't) (funny|that funny|even funny)
(i|) don't get it
(old|this old|repost|seen this already|seen it a hundred times)
(forced|trying too hard|so forced|corny|cringe)
(humor|comedy) (is|) (dead|dying|not what it used to be)
(straight face|didn't laugh once|not even a smile|didn't even exhale)
(who|who's) (laughing|finding this funny)(, be honest| at this|)
(skits|these skits|staged videos) (are|be) (getting|so) (old|tired|corny|bad)
(unfunny|not funny|dry|weak|mid)
(this|) (wasn't|was not) (it|worth the watch|worth my time)
(i|) (want|need) my (30 seconds|minute|time|data) back
(laughed|i laughed) at (nothing|none of it|zero of this)
(what|where) (is|was) (the joke|funny about this|the funny part)
`),
S:bank(`
(staged|fake|scripted|acting)(, still funny tho| and not even good acting|, obviously|)
(funny|it's funny) until (somebody|someone) (gets hurt|get hurt)
(yall|people) (laugh|will laugh) at (anything|everything)
(stolen|stole this) from (tiktok|twitter|somebody else)(, credit the creator|, as usual|)
(this|this is) why (aliens won't visit|other countries laugh at us|our ancestors are disappointed)
(lowkey|kinda) (sad|concerning|a cry for help)(, not funny| if you think about it| tho|)
(real or staged|staged or real|real or fake)(?|, be honest)
(funny or not funny|funny or trying too hard|funny or nah)(?|, be honest)
(somebody|someone) (gonna|is gonna|about to) (get cancelled|be offended|complain) (over|about|for) this
(can't|you can't) (joke|post) (like|stuff like) this (no more|anymore|in 2026)(, people too sensitive|)
(funnier|was funnier) (the first time|when the original creator did it|without the caption)
`),
F:bank(`
(i|) (laughed|wheezed|cackled|snorted) (so hard|) (at work|in class|in church|on the bus|in the meeting|at 3am) (and|now) (everybody|my boss|people) (looking|staring) (at me|)
(my|) (stomach|ribs|cheeks|abs) (hurt|hurting|are sore)
(woke|woke up) (my|the) (whole house|kids|roommate|dog|baby) (laughing|)
(spit|choked on|spilled) my (drink|water|coffee|food)
(new|this is my new) (personality|ringtone|favorite video|reaction pic)
(i|) (dropped|threw) my phone (laughing|)
(my|) (mom|grandma|coworker|boss) (asked|asking) (what's|what is) so funny
(can't|cannot) show (this|it) to (nobody|anybody) (without|because i keep) laughing (first|)
(laughed|i laughed) (way|) (harder|louder) than i should (have|)
(evil|ugly|villain) laugh (activated|came out|unlocked)
`),
N:bank(`
(who|who's) (is|) (this|that|the creator)
(original|og) (video|creator|sound)(?| who| link)
(what|what's) the (song|sound|audio)
(part 2|pt 2|more|we need more|another one)(?| please| asap|)
(context|wait what|what happened|huh)
(is|) (there|) (a|) (longer|full) (version|video|clip)(?|)
(where|where's) (this|it) from
(tag|tagging|had to tag) (somebody|a friend|my cousin|my brother) (who|that) (would|need to see this|act like this)
`)};
T.tour={
L:bank(`
(need|i need|getting) tickets (asap|immediately|today|rn)
(come|please come|yall coming) to (atlanta|houston|chicago|detroit|nyc|la|dallas|the bay|dc|philly|miami|memphis|charlotte|st louis|new orleans|toronto|london)
(take|shut up and take) my money
(this|that) (show|tour|lineup|setlist) (about|bout|going) to be (crazy|insane|a movie|legendary)
(saw|seen) {a} live (last year|once|twice|back in the day) (and|,) (best show ever|it was crazy|10/10)
(i'm|) (there|going|in there|front row)
(finally|about time|been waiting on this)
(who|who's) (going|coming|trying to go) (with me|)
(can't|cannot) (wait|miss this)
(this|) (the|) (tour|show) of the (year|summer)
{a} (live|in concert) (is|) (a different experience|another level|crazy|worth every dollar)
(already|i already) (got|requested) (my tickets|the day off|my outfit ready)
(road trip|flight|hotel) (booked|loading|incoming)(, idc how far|)
(the|) setlist (better|gotta|need to) (have|include) (the old stuff|the deep cuts|the classics|the whole album)
(me and|taking) (my|the) (girls|boys|homies|whole crew|sister|brother)(, we there|, we going|, we pulling up)
{a} (always|) (put|puts) on a (show|real show|crazy show)
(pit|floor|front row|barricade) or (nothing|i'm not going)
(been|i been) (saving|waiting) for (this|a {a} tour) (all year|for years|since the last one)
(outfit|the outfit|my fit) (already|) (picked out|planned|in the cart)
(opening night|first show|my city) (tickets|) (secured|or nothing|here i come)
(somebody|someone) (come|go) with me(, i'm serious|, i'll drive|)
(this|the) (lineup|bill) (is|) (stacked|crazy|unfair|insane)
(best|greatest) (news|thing i've seen) (all|this) (day|week|month)
`),
H:bank(`
(ticket|the ticket|ticketmaster) (prices|fees) (gonna|about to|finna) be (crazy|criminal|insane|disrespectful)
(not|ain't|i'm not) (paying|spending) (that|all that) (for|to see) {a}
(skipped|they skipped|always skip) my (city|state)(, as usual| again|)
(lip sync|backing track|30 minute set) (tour|incoming|again)
(who|who's) (buying|paying for|going to) (this|that)
(gonna|going to) be half (empty|full)
(no|not one) (date|show) (near|in|close to) (me|my city|my state)
(resale|resellers|scalpers|the bots) (about|bout) to (ruin it|eat|take all the tickets|charge triple)
(pass|i'll pass|i'm good|not for me)
{a} (show up|comes out) (late|2 hours late) (every time|to every show)
`),
S:bank(`
(won't|not gonna) sell out(, watch| half the dates| those arenas|)
(arenas|stadiums) (is|are) (a reach|too big|ambitious) (for {a}|)
(openers|the openers|the opener) (better|bigger|might be better) than the (headliner|main act)
(tour|touring) (cause|because) the (streams|album|money) (ain't|not) (paying|moving|selling)
(cancelled|canceled|postponed) (dates|shows) in (3|2|a few) (months|weeks)(, watch|, calling it now|)
(worth|is it worth) (the money|the price|it)(?| or nah|, be honest)
(clubs|small venues|theaters) (would|woulda|would have) (been|made) (smarter|more sense|better)
(best|worst) live (performer|show) (out|right now|in the game)(?|, don't @ me|, argue)
`),
F:bank(`
my (bank account|wallet|rent|landlord) (said|says) (no|absolutely not|sit this one out|stay home)
(selling|about to sell) (a kidney|my couch|plasma|my car) for (tickets|floor seats|front row)
(nosebleeds|the parking lot|outside the venue)(, here i come| it is| for me)
(called|calling) (out|in sick) (already|that day|in advance)
(i'll|i will) (be|) (listening|watching) from (the parking lot|outside|ig live|somebody's story)
(rent|the rent|my bills) (can|gonna have to|will) wait
`),
N:bank(`
(when|what time) (do|) tickets (go on sale|drop|come out)
(dates|cities|full dates|what cities)(?| please|)
(who|who's) (opening|the opener|on the lineup)
(presale|pre sale) code(?| anybody| anyone|)
(how much|price) (are|for) (tickets|floor|vip)
(is|) (it|this) (all ages|18+|21+)(?|)
(any|is there any|are there) (international|overseas|canada|uk|west coast|east coast|southern) dates
(is|) (there|) (a|) (second|2nd) (leg|round of dates|show) (coming|)(?|)
`)};
/* a short second thought tacked on to a short comment (same mood, safe on any subject in that group) */
const TAIL={
 music:{L:['run it up','keep going','don\'t stop','we see you','instant fan','you got one','keep cooking','on repeat','no skip','easy'],H:['do better','next','back to the studio','try again','sorry','just being honest'],
  S:['argue with the wall','don\'t @ me','prove me wrong','change my mind','tell me i\'m wrong','who agrees','be honest','i said what i said'],F:['i\'m done','i can\'t','help','somebody come get me','pray for me'],N:['anybody know','just asking','real question']},
 news:{L:[],H:['smh','do better','just being honest','i said what i said'],S:['don\'t @ me','prove me wrong','change my mind','who agrees','tell me i\'m wrong','just saying'],F:['i\'m done','i can\'t','help'],N:['anybody know','just asking','real question']}};
const PRE={L:['nah','bro','yo','ngl','ok','aye','man','lowkey','honestly','not gonna lie','listen','yeah'],H:['nah','bro','ngl','honestly','sorry but','idk','man','respectfully','be fr','i\'m sorry but'],
 S:['ngl','honestly','real talk','idc','i\'m sorry but','let\'s be real','say what you want but','nah'],F:['bro','nah','yo','lmao','not gonna lie','help','BRO'],N:['wait','yo','ok but','real question','serious question','aye']};
const SUF={L:['fr','fr fr','no cap','ngl','man','bro','tbh','on god','for real','period','tho'],H:['smh','ngl','tbh','fr','sorry','idc','lol','man','tho','respectfully'],
 S:['idc','tho','fr','just saying','but go off','and i stand on that','period'],F:['lmao','lol','bro','fr','man','help'],N:['tho','fr','lol']};
const EMO={L:['🔥','🔥🔥','🔥🔥🔥','💯','🐐','😮‍💨','🙌','👏','🎯','‼️','😤','🫡','💪','🔊','🔥💯'],H:['🗑️','😴','👎','🤦','😬','🥱','😐','🚮','🤨','🤦‍♂️'],S:['👀','🤔','🤷','☕','🧐','💯','🗣️','😳','🤷‍♂️'],
 F:['😭','😭😭','💀','💀💀','😂','🤣','😭😭😭','😂😂'],N:['🤔','👀'],rnb:['😩','🥹','😍','❤️‍🔥','🔥','💯'],sad:['🙏','🕊️','💔','🙏🏾','😔','🙏🕊️','💔🙏'],hurt:['🙏','🙏🏾','😔','🙏🙏','❤️‍🩹','🙏🏽'],newsL:['👏','💯','🙌','🫡','👍','🔥'],support:['🙏','💯','🙏🏾','⛓️']};
const SPEAK=[[/\byou\b/g,'u',.6],[/\byour\b/g,'ur',.5],[/\bthough\b/g,'tho',.9],[/\bbecause\b/g,'cuz',.7],[/\bwith\b/g,'wit',.25],[/\babout\b/g,'bout',.4],[/\bgoing to\b/g,'gonna',.8],[/\bright now\b/g,'rn',.6],[/\bfor real\b/g,'fr',.6],
 [/\bsomething\b/g,'sum',.25],[/\bnothing\b/g,'nun',.2],[/\bprobably\b/g,'prolly',.6],[/\bpeople\b/g,'ppl',.35],[/\bplease\b/g,'pls',.5],[/\bokay\b/g,'ok',.7],[/\bwant to\b/g,'wanna',.8],[/\bgot to\b/g,'gotta',.8],[/\bthis\b/g,'dis',.04],[/\bthat\b/g,'dat',.04],[/\band\b/g,'n',.06],[/\bto be honest\b/g,'tbh',.8],[/\bthe\b/g,'da',.03]];
const SAD=t=>t==='rip'||t==='hurt';
const FAMILY=t=>['rap','rnb','album','video'].includes(t)?'music':'news';
/* which lists a topic draws from: [list, share] */
function pool(topic,tone){if(SAD(topic))return [[T[topic].L,1]];
 if(topic==='rap')return [[T.music[tone],1]];
 if(FAMILY(topic)==='music'){const x=T[topic][tone];return x&&x.length?[[x,.38],[T.music[tone],.62]]:[[T.music[tone],1]]}
 return [[T[topic][tone],1]]}
function alt(t){let g=0;while(/\(([^()]*)\)/.test(t)&&g++<60)t=t.replace(/\(([^()]*)\)/,(m,x)=>pick(x.split('|')));return t}
const PRO={him:{he:'he',him:'him',his:'his',bro:['bro','dude','my boy','he','bro really'],himx:['him','that guy','the one']},her:{he:'she',him:'her',his:'her',bro:['sis','she','she really','shorty'],himx:['her','that girl','the one']},
 they:{he:'they',him:'them',his:'their',bro:['they','the gang','they really'],himx:['them','the ones']}};
function fill(tpl,S){let t=alt(tpl),bad=false;const P=PRO[S.pro],rnb=S.topic==='rnb';
 t=t.replace(/<([^|>]*)\|([^>]*)>/g,(m,a,b)=>S.pro==='they'?b:a);
 t=t.replace(/\{(\w+)\}/g,(m,k)=>{let v;
  if(k==='a')v=S.a;else if(k==='a2')v=S.a2;else if(k==='s')v=S.s;
  else if(k==='rap')v=rnb?'singing':'rapping';else if(k==='rapper')v=rnb?'singer':pick(['rapper','artist']);else if(k==='bars')v=rnb?pick(['the lyrics','the writing','the pen']):pick(['the bars','the lyrics','the pen']);
  else if(k==='genre')v=rnb?pick(['r&b','real music']):pick(['rap','hip hop','real music','the underground']);
  else if(k==='his')v=P?P.his:(S.a?S.a+"'s":'');else if(k==='bro'||k==='himx')v=P?pick(P[k]):(k==='himx'?pick(['the one','that one']):S.a);
  else if(k==='he'||k==='him')v=P?P[k]:S.a;
  if(!v)bad=true;return v||''});
 if(bad)return null;
 return t.replace(/\s+/g,' ').replace(/ ([,?!:])/g,'$1').replace(/^[,:]\s*/,'').replace(/[,:]\s*$/,'').trim()}
const hasWord=t=>/[a-z]/i.test(t);
/* type it the way people type */
function style(t,tone,S,tail){if(!hasWord(t))return t;const sad=SAD(S.topic),fam=FAMILY(S.topic);
 const pre=PRE[tone],suf=SUF[tone];
 if(!sad&&R(tail?.05:.13)&&t.length<70){const p=pick(pre);if(!new RegExp('^('+pre.join('|')+')\\b','i').test(t)&&!/^(be |real talk|unpopular|hot take|might|am i|i'm the|ok|okay|alright|oh|yeah|if |which|who|what|when|where|why|how|is |not |no |sorry|whoever|somebody|someone)/i.test(t))t=p+' '+t}
 const q=/\?$/.test(t);
 if(!sad&&!q&&!tail&&R(.15)&&t.length<70){const s=pick(suf);if(!new RegExp('\\b'+s+'$','i').test(t))t=t+' '+s}
 if(!q&&tone==='N'&&/^(who|what|when|where|why|how|is|are|did|has|does|do|can|any|anybody|anyone|which)\b/i.test(t)&&R(.55))t+='?';
 if(R(.42))SPEAK.forEach(([r,w,p])=>{if(R(p))t=t.replace(r,w)});
 if(R(.5))t=t.replace(/(\w)'(\w)/g,'$1$2');
 const r=Math.random();
 if(r<.62)t=t.toLowerCase().replace(/^(big |huge |)([wl])\b(?= (for|move|take|news)|$)/,(m,a,b)=>a+b.toUpperCase());
 else if(r<.69&&t.length<26&&!sad&&tone!=='N')t=t.toUpperCase();
 else t=(t[0].toUpperCase()+t.slice(1)).replace(/\bi\b/g,'I').replace(/\bi'm\b/gi,"I'm").replace(/\bim\b/g,'Im');
 if(!sad&&!/\?$/.test(t)&&R(.06)){const m=t.match(/([a-z]{3,})$/i);if(m&&!/(fr|ngl|tbh|idc|lol|smh)$/i.test(t))t=t+t.slice(-1).repeat(2+Math.floor(Math.random()*4))}
 if(!/\?$/.test(t)&&R(.05)&&!sad)t+=tone==='H'?'...':tone==='L'||tone==='F'?'!!':'';
 let E=S.topic==='hurt'?EMO.hurt:sad?EMO.sad:tone==='L'?(fam==='music'?(S.topic==='rnb'?EMO.rnb.concat(EMO.L):EMO.L):S.topic==='legal'?EMO.support:EMO.newsL):EMO[tone];
 if(S.topic==='funnyvid'&&tone==='L')E=EMO.F;if(S.topic==='wild'&&tone==='L')E=['😳','😭','💀','🤯','😱','👀'];
 if(R(sad?.5:tone==='N'?.12:.4))t+=' '+pick(E);
 return t}
/* ---- never twice for the same subject (kept in this browser) ---- */
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)};
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');
let USED=null;const loadUsed=()=>{if(USED)return USED;try{USED=new Set((localStorage.getItem('cmt_used')||'').split(',').filter(Boolean))}catch(e){USED=new Set()}return USED};
const saveUsed=()=>{try{let a=[...USED];if(a.length>40000)a=a.slice(-40000);localStorage.setItem('cmt_used',a.join(','))}catch(e){}};
const EXTRA=()=>{const o={L:[],H:[],S:[],F:[],N:[]};let v='';try{v=localStorage.getItem('cmt_extra')||''}catch(e){}v.split('\n').map(x=>x.trim()).filter(Boolean).forEach(l=>{const k={'+':'L','-':'H','!':'S','?':'N'}[l[0]];o[k||'F'].push((k?l.slice(1):l).trim().replace(/\bNAME\b/g,'{a}').replace(/\bSONG\b/g,'{s}'))});return o};
const AIL={};/* lines the small AI wrote, by subject key then tone */
/* S: {topic, a, a2, s, pro}. mix: {L,H,S,F,N} weights. Returns [{t,tone}] */
function make(S,n,mix){const used=loadUsed(),sk=norm([S.topic,S.a,S.s,S.k].join('|')),sad=SAD(S.topic),out=[],seen=new Set(),cnt=new Map(),extra=EXTRA(),ai=AIL[sk]||{};
 const tones=sad?['L']:['L','H','S','F','N'].filter(k=>mix[k]>0),tot=tones.reduce((a,k)=>a+(sad?1:mix[k]),0);
 const want={};tones.forEach(k=>want[k]=sad?n:Math.round(n*mix[k]/tot));const got={};tones.forEach(k=>got[k]=0);
 const fam=FAMILY(S.topic);let tries=0,cap=3;
 while(out.length<n&&tries++<n*220){if(tries===n*90)cap=8;if(tries===n*160)cap=999;
  let open=tones.filter(k=>got[k]<want[k]);if(!open.length)open=tones;const tone=pick(open);
  let tpl,src='';const ex=extra[tone],al=sad?[]:(ai[tone]||[]);
  if(al.length&&R(.3)){tpl=pick(al);src='ai'}else if(!sad&&ex.length&&R(.12)){tpl=pick(ex);src='own'}
  else{const P=pool(S.topic,tone);let r=Math.random(),L=P[0][0];for(const [l,w] of P){if(r<w){L=l;break}r-=w}tpl=pick(L)}
  if(!tpl)continue;const c=cnt.get(tpl)||0;if(c>=(src?1:cap))continue;
  let core=src==='ai'?tpl:fill(tpl,S);if(!core)continue;
  const tails=(TAIL[fam][tone]||[]);let tail=0;if(!src&&!sad&&tails.length&&core.length<34&&hasWord(core)&&!/[?,:]/.test(core)&&R(.15)){core+=', '+pick(tails);tail=1}
  const key=norm(core.replace(/\b(is|was|are|be|been|the|a|i|i'm|im|it's|its|really|just)\b/gi,''))||core;if(seen.has(key))continue;const h=hash(sk+'|'+key);if(used.has(h))continue;
  seen.add(key);used.add(h);cnt.set(tpl,c+1);got[tone]++;out.push({t:style(core,tone,S,tail),tone:sad?'L':tone,src})}
 saveUsed();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
/* ---- what kind of story is it ---- */
const KIND=[['rip',/\b(rip|r\.i\.p|dies|died|dead at|passed away|passes away|death of|killed|fatal|funeral|tribute to|mourns?|remembering|found dead|overdose)\b/i],
 ['hurt',/\b(shot|shooting|hospitalized|hospital|injured|crash|accident|stabbed|robbed|critical condition|wounded)\b/i],
 ['legal',/\b(court|arrest(ed)?|charged|charges|lawsuit|sued|sues|trial|sentenced|jail|prison|indicted|rico|guilty|verdict|police|feds|warrant|bail|bond|robbery|raid|custody)\b/i],
 ['beef',/\b(beef|diss(es|ed)?|feud|clap ?s? ?back|responds? to|fires? back|shots at|calls? out|goes at|vs\.?)\b/i],
 ['tour',/\b(tour|concert|festival|tickets|live show|residency)\b/i],
 ['album',/\b(album|tracklist|deluxe|mixtape|ep)\b/i],['video',/\b(music video|visual|official video)\b/i],
 ['rap',/\b(drops?|dropped|releases?|new (single|song|music|track)|out now|snippet|remix|freestyle)\b/i],
 ['funnyvid',/\b(funny|hilarious|lol|meme|comedy|skit|jokes?|roast(ed|s)?|laugh)\b/i],
 ['wild',/\b(wild|crazy|fight|brawl|goes off|chaos|caught on (camera|video)|viral|shocking|insane|wtf|chase|melee)\b/i]];
const kindOf=t=>{const k=KIND.find(([,r])=>r.test(t||''));return k?k[0]:'general'};
const VERB=/\b(drops?|dropped|releases?|released|arrested|charged|dies|dead|died|passes|passed|responds?|announces?|says?|said|shot|sued|sues|reacts?|claps?|signs?|signed|shares?|reveals?|speaks?|goes|gets?|got|is|was|has|calls?|fires?|addresses|denies|confirms?|buys?|wins?|loses?|joins?|teases?|unveils?|breaks?|slams?|returns?|launches|performs?|sentenced|indicted|hospitalized|robbed|found|faces?|pleads?|explains?|admits?|debuts?|links?|brings?|takes?|makes?|gives?|talks?|opens|just|allegedly|reportedly|officially|finally)\b/i;
const tc=s=>s===s.toUpperCase()?s.toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase()):s;
function whoOf(title){let t=String(title||'').replace(/^[^A-Za-z0-9$]*/,'').replace(/^(breaking|exclusive|update|watch|just in|news|new music|report|video)\s*[:!\-]\s*/i,'');const m=t.match(VERB);if(!m||!m.index)return '';const w=t.slice(0,m.index).trim().replace(/[,:\-]+$/,'');return w&&w.split(/\s+/).length<=4?tc(w):''}
const names=s=>String(s||'').split(/\s*(?:,|&|\bx\b|\bft\.?|\bfeat\.?|\bfeaturing|\band\b|\bwith\b)\s*/i).map(x=>x.trim()).filter(Boolean);

/* ------------------------------------------------ the small AI (optional): runs in this browser, no account, no limit */
let ENG=null,ENGID='';
const AIBAD=/\b(as an ai|here are|here's|sure|certainly|comment|delve|testament|vibrant|resonates?|truly|masterpiece|showcas|captivat|kudos|bravo|indeed|moreover|furthermore|absolutely|incredible|amazing|talented|kudos|hashtag|nigg\w*|bitch\w*|fuck\w*|shit\w*|hoe|hoes|fag\w*|retard\w*|rape\w*|kill yourself)\b|[#*"“”()\[\]]|^\W*$/i;
async function aiLines(S,headline,st){if(!navigator.gpu)throw new Error('This browser cannot run the small AI (it needs WebGPU: use Chrome, Edge or Brave on a computer with a graphics card). The comments still work without it.');
 st('Loading the small AI…');const w=await import('https://esm.run/@mlc-ai/web-llm');
 if(!ENG){const have=w.prebuiltAppConfig.model_list.map(m=>m.model_id);ENGID=['Qwen2.5-1.5B-Instruct-q4f16_1-MLC','Llama-3.2-1B-Instruct-q4f16_1-MLC','Qwen2.5-0.5B-Instruct-q4f16_1-MLC','SmolLM2-360M-Instruct-q4f16_1-MLC'].find(x=>have.includes(x))||have.find(x=>/(1\.5B|1B|0\.5B).*Instruct/i.test(x));
  if(!ENGID)throw new Error('No small model found');ENG=await w.CreateMLCEngine(ENGID,{initProgressCallback:p=>st('Getting the AI ready (first time is a big download, after that it is saved): '+esc(p.text||''))})}
 const sk=norm([S.topic,S.a,S.s,S.k].join('|')),o=AIL[sk]=AIL[sk]||{},sad=SAD(S.topic);
 const what=FAMILY(S.topic)==='music'?`a new ${S.topic==='rnb'?'R&B':'rap'} ${S.topic==='album'?'album':S.topic==='video'?'music video':'song'}${S.s?` called "${S.s}"`:''}${S.a?' by '+S.a:''}`:`this news: "${headline||S.a}"`;
 const moods=sad?{L:'sad and respectful, sending prayers'}:{L:'they love it',H:'they do not like it',S:'a controversial hot take that starts arguments',F:'a joke about it',N:'a short question about it'};
 for(const k of Object.keys(moods)){st('The AI is writing: '+moods[k]+'…');const eg=make({...S},6,{L:0,H:0,S:0,F:0,N:0,[k]:1}).map(x=>x.t.replace(/[^\x00-\x7F]+/g,'').trim()).filter(Boolean);
  eg.forEach(()=>0);const r=await ENG.chat.completions.create({temperature:.7,top_p:.9,frequency_penalty:.4,max_tokens:420,messages:[{role:'system',content:'You write short social media comments exactly like real hip-hop fans type them: casual, lowercase, slang, blunt, no hashtags, no emojis, no quotes, no numbering. Never sound like an ad or a review. One comment per line.'},
   {role:'user',content:`People are commenting on ${what}.\nMood: ${moods[k]}.\nWrite 14 different comments, 3 to 14 words each, that are about this exact subject.\nExamples of the style:\n${eg.join('\n')}`}]});
  const L=String(r.choices[0].message.content||'').split('\n').map(x=>x.replace(/^[\s\-\*\d\.\)"'“”]+|["'“”\s]+$/g,'').trim()).filter(x=>x.length>=6&&x.length<=110&&x.split(/\s+/).length<=18&&!AIBAD.test(x));
  o[k]=[...new Set((o[k]||[]).concat(L))]}
 return Object.values(o).reduce((a,x)=>a+x.length,0)}

/* ------------------------------------------------ the tab */
const NAMES={L:'GOOD',H:'BAD',S:'CONTROVERSIAL',F:'FUNNY',N:'OTHER'};
const KINDS={drop:[['rap','RAP / HIP-HOP'],['rnb','R&B'],['album','ALBUM / TAPE'],['video','MUSIC VIDEO']],
 news:[['general','NEWS'],['rap','NEW MUSIC'],['beef','BEEF'],['legal','CRIME + COURT'],['rip','TRAGIC: PASSED AWAY'],['hurt','TRAGIC: SOMEONE HURT'],['wild','WILD VIDEO'],['funnyvid','FUNNY VIDEO'],['tour','TOUR + SHOWS']]};
function init(){const box=document.getElementById('t-comments');if(!box||box.dataset.on)return;box.dataset.on=1;
 const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return ''}};
 let st0={};try{st0=JSON.parse(LS('cmt_state')||'{}')}catch(e){}
 const V={from:st0.from||'drop',topic:st0.topic||'rap',pro:st0.pro||'',n:st0.n||300,kindSet:false},LIST=[];let filt='';
 box.innerHTML=`<p class="sub">Comments for what you made in THE DROP or NEWS. It reads the subject, then writes a fresh batch every time: good ones, bad ones, controversial ones and jokes, typed the way people type. A comment is never made twice for the same subject.</p>
 <div class="ctl"><div class="cur">THE SUBJECT <span>(filled in from what you made, change anything)</span></div>
 <div class="seg"><button data-cf="drop">FROM THE DROP</button><button data-cf="news">FROM THE NEWS</button></div>
 <span id="cm-drop"><input id="cma" class="tx" placeholder="Artist name"><input id="cms" class="tx" placeholder="Song name"></span>
 <span id="cm-news" style="display:contents"><input id="cmt" class="tx" placeholder="Headline" style="min-width:300px"><input id="cmw" class="tx" placeholder="Who it is about (name)"></span>
 <div class="cm-row"><b>WHAT KIND</b><span id="cm-kinds"></span></div>
 <div class="cm-row"><b>THEY ARE</b><div class="seg"><button data-cp="">NOT SURE</button><button data-cp="him">HIM</button><button data-cp="her">HER</button><button data-cp="they">A GROUP</button></div><small>so the comments say he, she or they the right way</small></div></div>
 <div class="ctl"><div class="cur">THE METER <span>(how the comments lean)</span></div>
 ${[['L','👍 GOOD',55],['H','👎 BAD',20],['S','🌶 CONTROVERSIAL',15],['D','🎲 JOKES + OTHER',10]].map(([k,n,d])=>`<div class="sl"><span>${n} <b data-pc="${k}"></b></span><input type="range" data-m="${k}" min="0" max="100" value="${st0['m'+k]==null?d:st0['m'+k]}"></div>`).join('')}
 <small id="cm-sad" hidden>Tragic news: every comment is respectful. No jokes, no hate, whatever the meter says.</small>
 <div class="cm-row"><b>HOW MANY</b><div class="seg"><button data-cn="50">50</button><button data-cn="100">100</button><button data-cn="300">300</button></div></div>
 <button id="cm-go" class="go">MAKE THE COMMENTS</button><button id="cm-all" class="go gr2">COPY ALL</button><button id="cm-ai" class="go gr2"${window.RM_CMT_AI?'':' hidden'}>🤖 ADD THE SMALL AI</button>
 <small id="cm-st">Nothing leaves this computer.</small></div>
 <div class="ctl" id="cm-bar" hidden><div class="seg" id="cm-f"></div><small>Click a comment to copy it. Copied ones go dim so you know which you used.</small></div>
 <div id="cm-list"></div>
 <details class="cm-own"><summary>ADD YOUR OWN LINES AND SLANG</summary><small>One per line. Start a line with <b>+</b> for a good one, <b>-</b> for a bad one, <b>!</b> for a controversial one, <b>?</b> for a question, nothing for a joke. Write NAME where the artist goes and SONG where the song goes. Saved on this computer and mixed into every batch.</small>
 <textarea id="cm-own" placeholder="+ NAME got the streets on lock\n- this aint the one twin\n! SONG is carried by the beat"></textarea><button id="cm-mem" class="rs">FORGET PAST COMMENTS</button></details>`;
 const $=s=>box.querySelector(s),$$=s=>box.querySelectorAll(s),msg=h=>$('#cm-st').innerHTML=h,toast=t=>{if(typeof say==='function')say(t);else msg(esc(t))};
 const save=()=>{const o={from:V.from,topic:V.topic,pro:V.pro,n:V.n};$$('[data-m]').forEach(i=>o['m'+i.dataset.m]=+i.value);LS('cmt_state',JSON.stringify(o))};
 const mix=()=>{const g=k=>+$(`[data-m="${k}"]`).value,d=g('D');return {L:g('L'),H:g('H'),S:g('S'),F:d*.6,N:d*.4}};
 const drawKinds=()=>{$('#cm-kinds').innerHTML='<div class="seg">'+KINDS[V.from].map(([k,n])=>`<button data-ck="${k}" class="${k===V.topic?'on':''}">${n}</button>`).join('')+'</div>'};
 const draw=()=>{$$('[data-cf]').forEach(b=>b.classList.toggle('on',b.dataset.cf===V.from));$('#cm-drop').style.display=V.from==='drop'?'contents':'none';$('#cm-news').style.display=V.from==='news'?'contents':'none';
  if(!KINDS[V.from].some(([k])=>k===V.topic))V.topic=KINDS[V.from][0][0];drawKinds();
  $$('[data-cp]').forEach(b=>b.classList.toggle('on',b.dataset.cp===V.pro));$$('[data-cn]').forEach(b=>b.classList.toggle('on',+b.dataset.cn===V.n));
  const m=mix(),t=m.L+m.H+m.S+m.F+m.N||1,pc={L:m.L,H:m.H,S:m.S,D:m.F+m.N};Object.keys(pc).forEach(k=>$(`[data-pc="${k}"]`).textContent=Math.round(pc[k]/t*100)+'%');
  $('#cm-sad').hidden=!SAD(V.topic);$('#cm-go').textContent=`MAKE ${V.n} COMMENTS`};
 /* pull the subject from the Drop and News boxes on this page (or what was typed there last) */
 const el=id=>document.getElementById(id),val=id=>(el(id)&&el(id).value||'').trim();
 const NEWSDEMO='BREAKING: ARTIST DROPS SURPRISE ALBUM';
 const pull=()=>{let last={};try{last=JSON.parse(LS('cmt_subj')||'{}')}catch(e){}
  const a=val('da')||last.a||'',s=val('ds')||last.s||'',nt=(val('nt')&&val('nt')!==NEWSDEMO?val('nt'):'')||last.t||val('nt');
  if(!$('#cma').value)$('#cma').value=tc(a);if(!$('#cms').value)$('#cms').value=tc(s);
  if(!$('#cmt').value&&nt){$('#cmt').value=nt;$('#cmw').value=whoOf(nt);if(V.from==='news'&&!V.kindSet)V.topic=kindOf(nt+' '+val('ncap'))}};
 ['da','ds','nt'].forEach(id=>{const i=el(id);if(i)i.addEventListener('input',()=>{const o={a:val('da'),s:val('ds'),t:val('nt')===NEWSDEMO?'':val('nt')};LS('cmt_subj',JSON.stringify(o));
  if(id==='nt'){$('#cmt').value=val('nt');$('#cmw').value=whoOf(val('nt'));if(!V.kindSet&&V.from==='news')V.topic=kindOf(val('nt'))}else{$('#cma').value=tc(val('da'));$('#cms').value=tc(val('ds'))}})});
 $('#cmt').addEventListener('input',()=>{$('#cmw').value=whoOf($('#cmt').value);if(!V.kindSet){V.topic=kindOf($('#cmt').value);drawKinds()}});
 const subject=()=>{if(V.from==='drop'){const N=names($('#cma').value);return {topic:V.topic,a:N[0]||'',a2:N[1]||'',s:$('#cms').value.trim(),pro:V.pro}}
  const N=names($('#cmw').value);return {topic:V.topic,a:N[0]||'',a2:N[1]||'',s:'',pro:V.pro,k:$('#cmt').value.trim()}};
 const show=()=>{const L=LIST.filter(x=>!filt||x.tone===filt);$('#cm-bar').hidden=!LIST.length;
  const c={};LIST.forEach(x=>c[x.tone]=(c[x.tone]||0)+1);$('#cm-f').innerHTML=`<button data-f="" class="${filt?'':'on'}">ALL ${LIST.length}</button>`+Object.keys(NAMES).filter(k=>c[k]).map(k=>`<button data-f="${k}" class="${filt===k?'on':''}">${SAD(V.topic)?'RESPECT':NAMES[k]} ${c[k]}</button>`).join('');
  $('#cm-list').innerHTML=L.map(x=>`<button class="cm-c t${x.tone}${x.done?' done':''}" data-i="${LIST.indexOf(x)}"><i></i><span>${esc(x.t)}</span>${x.src==='ai'?'<em>AI</em>':''}<u>COPY</u></button>`).join('')};
 const copy=async t=>{try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}};
 box.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.cf!=null){V.from=d.cf;V.kindSet=false;LS('stu_last',d.cf);if(V.from==='news'&&$('#cmt').value)V.topic=kindOf($('#cmt').value);draw();save()}
  else if(d.ck){V.topic=d.ck;V.kindSet=true;draw();save()}else if(d.cp!=null){V.pro=d.cp;draw();save()}else if(d.cn){V.n=+d.cn;draw();save()}
  else if(d.f!=null){filt=d.f;show()}
  else if(d.i!=null){const x=LIST[+d.i];await copy(x.t);x.done=1;b.classList.add('done');b.querySelector('u').textContent='COPIED ✓';toast('Copied')}});
 $$('[data-m]').forEach(i=>i.oninput=()=>{draw();save()});
 $('#cm-go').onclick=()=>{const S=subject();if(!S.a&&FAMILY(S.topic)==='music'){msg('<b class="cm-w">Type the artist name first.</b>');return}
  const t0=performance.now(),L=make(S,V.n,mix());LIST.length=0;L.forEach(x=>LIST.push(x));filt='';show();
  msg(L.length<V.n?`<b class="cm-w">Made ${L.length}. That is every new comment left for this subject with this meter: move the meter, add your own lines, or use the small AI for more.</b>`:`Made ${L.length} new comments in ${Math.max(1,Math.round(performance.now()-t0))} ms. Press it again for a whole new batch.`);
  $('#cm-list').scrollIntoView({behavior:'smooth',block:'start'})};
 $('#cm-all').onclick=async()=>{const L=LIST.filter(x=>!filt||x.tone===filt);if(!L.length){msg('Make the comments first.');return}await copy(L.map(x=>x.t).join('\n'));toast(L.length+' comments copied')};
 $('#cm-ai').onclick=async()=>{const b=$('#cm-ai');b.disabled=true;try{const S=subject();if(!S.a&&!$('#cmt').value){msg('<b class="cm-w">Type the subject first.</b>');b.disabled=false;return}
   const n=await aiLines(S,V.from==='news'?$('#cmt').value:'',msg);msg(`The small AI wrote ${n} lines about this subject. Press MAKE to mix them in (they show an AI tag).`)}catch(e){msg('<b class="cm-w">'+esc(e.message||e)+'</b>')}b.disabled=false};
 $('#cm-own').value=LS('cmt_extra');$('#cm-own').oninput=()=>LS('cmt_extra',$('#cm-own').value);
 $('#cm-mem').onclick=()=>{USED=new Set();saveUsed();toast('Memory cleared')};
 const tabBtn=document.querySelector('[data-tab="comments"]');
 /* the subject comes from the tab you were just on */
 const on0=document.querySelector('[data-tab].on');if(on0&&on0.dataset.tab!=='comments')LS('stu_last',on0.dataset.tab);
 const enter=()=>{const last=LS('stu_last');if(last)V.from=last==='news'?'news':'drop';pull();if(V.from==='news'&&!V.kindSet&&$('#cmt').value)V.topic=kindOf($('#cmt').value+' '+val('ncap'));draw()};
 if(tabBtn)tabBtn.addEventListener('click',enter);
 document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.tab!=='comments'){try{localStorage.setItem('stu_last',b.dataset.tab)}catch(e){}V.from=b.dataset.tab==='news'?'news':'drop';V.kindSet=false;['#cma','#cms','#cmt','#cmw'].forEach(s=>$(s).value='')}}));
 enter()}
window.CMT={make,kindOf,whoOf,T,init,fill};
const css=document.createElement('style');css.textContent=`#t-comments .cm-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;width:100%;margin-top:4px}#t-comments .cm-row>b{font:800 11px Inter,sans-serif;letter-spacing:.14em;color:#bbb;min-width:90px}
#t-comments [hidden]{display:none!important}#t-comments .seg{flex-wrap:wrap}#t-comments .sl b{color:#e11d2a;margin-left:4px}
#cm-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:6px;margin:14px 0 30px}
.cm-c{display:flex;align-items:center;gap:10px;text-align:left;background:#141414;border:1px solid #2a2a2a;color:#fff;padding:10px 12px;font:15px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;min-height:44px}
.cm-c:hover{border-color:#e11d2a}.cm-c span{flex:1;overflow-wrap:anywhere}.cm-c i{width:8px;height:8px;border-radius:50%;flex:none;background:#888}.cm-c.tL i{background:#2ecc71}.cm-c.tH i{background:#e11d2a}.cm-c.tS i{background:#f39c12}.cm-c.tF i{background:#4aa3ff}
.cm-c u{text-decoration:none;font:800 10px Inter,sans-serif;letter-spacing:.12em;color:#888;flex:none}.cm-c em{font:800 9px Inter,sans-serif;letter-spacing:.1em;color:#111;background:#f39c12;padding:2px 5px;font-style:normal;flex:none}
.cm-c.done{opacity:.35}.cm-w{color:#e8a33a}
.cm-own{margin:0 0 40px;color:#bbb;font:13px Inter,sans-serif}.cm-own summary{cursor:pointer;font:800 12px Inter,sans-serif;letter-spacing:.14em;color:#fff;padding:10px 0}.cm-own textarea{display:block;width:100%;min-height:120px;margin:10px 0;background:#0b0b0b;border:1px solid #333;color:#fff;padding:10px;font:14px system-ui,sans-serif;box-sizing:border-box}`;
document.head.appendChild(css);
if(document.readyState==='loading')addEventListener('DOMContentLoaded',init);else init();
})();
