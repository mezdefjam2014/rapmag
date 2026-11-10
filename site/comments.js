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
(stay strong|hold ya head|hold it down) {a}
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
(lost another one|we lost a legend|we lost a good one|losing another real one|we keep losing the real ones)
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
(still in shock|still processing this|i can't process this|still can't wrap my head around it)
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
(is there a second leg coming|second round of dates coming|any chance of a second show)
`)};
/* ------------------------------------------------ second bank: many more lines, more voices.
   A line starting with ^ is someone who types properly. [asp] [ver] [bad] pull from the lists in G.
   T = said to somebody. E (emojis only) is made by emo() below. */
const G={
asp:`the beat|the hook|the flow|the second verse|the first verse|the production|the bridge|the intro|the outro|the chorus|the sample|the bass|the drums|the 808s|the melody|the ad libs|the cadence|the delivery|the wordplay|the pen|the mix|the vocals|the energy|the beat switch|the opening line|the last verse|the pocket|the bounce|the tempo|the storytelling|that first bar|the way {he} came in|the way {he} rode the beat|{his} voice|{his} tone|the whole song|every single bar|the last 30 seconds|the build up|the breakdown|the harmonies|the layering|the snare|the piano|the guitar|the strings|the low end|the transition|that pause before the drop|the rhyme scheme`.split('|'),
ver:`is crazy|went stupid|is on another level|got me in a chokehold|need to be studied|is undefeated|had no business being this good|is doing something to me|deserve an award|living rent free in my head|caught me off guard|is different|is hard as nails|is disgusting in the best way|is pure butter|is filthy|is a problem|is too clean|hit me in the chest|is elite|is top tier|is next level|is outrageous|is beautiful|is wicked|is menacing|gave me chills|is smooth like water|is exactly what i needed|is sick|is vicious|is immaculate|scratched an itch i ain't know i had|is criminal|should be illegal|is diabolical|is nuts|is serious|woke me up|is silly|got my head nodding|is certified|is ruthless|is gorgeous|made my whole morning|is unreal|is so satisfying|is a cheat code|is sharp|is something special|is perfect|is A1|is five stars|is premium|is luxury|is expensive sounding|is mean|is rude|is lethal|sound like money|is God tier|is addictive|is haunting|is so tough|is cold blooded|is flawless|aged well already|is wild|is bananas|got replay value|is timeless`.split('|'),
bad:`is weak|is lazy|ruined it|threw me off|is all over the place|is giving nothing|needed more work|is off beat|is painful|is drowning everything out|sound cheap|sound rushed|is basic|is dated|is messy|is flat|is annoying|got old fast|is doing too much|is doing too little|is distracting|sound like a demo|is copy and paste|lost me|is not hitting|fell apart|is rough on the ears|sound unfinished|is tired|is recycled|is stale|is empty|is forgettable|put me to sleep|killed the whole vibe`.split('|')};
const add=(k,t,x)=>{(T[k]=T[k]||{})[t]=((T[k]||{})[t]||[]).concat(bank(x))};
add('music','L',`
[asp] [ver]
[asp] [ver]
[asp] [ver]
{a} came through with it
{a} understood the assignment
{a} cooking with grease
{a} really outside with this one
{a} got the juice
{a} locked in
{a} ain't letting up
{a} on a run right now
{a} got a classic on {his} hands
{a} making it look easy
{a} in rare form
{a} sound hungry
{a} sound comfortable on this
{a} found {his} sound
{a} leveled up
{a} stepping
{a} too consistent
{a} got my attention now
{a} just earned a new fan
{a} about to have a big year
{a} deserve a bigger stage
{a} got next, i'm calling it
{a} putting on for the independents
{s} is a certified slapper
{s} got me moving
{s} is a whole mood
{s} going straight to the top of my playlist
{s} about to be everywhere
{s} is my new alarm
{s} is the soundtrack to my week
{s} deserve a spot on the charts
{s} gonna age like wine
{s} got that feeling
{s} belong on the radio
{s} is an earworm
{s} for the summer playlist
{s} on loop till further notice
somebody's cousin put me on to this and i owe them
my whole commute is this song now
shazam brought me here, staying for the catalog
heard this at the barbershop and had to find it
heard this in somebody's story and went looking
walked in the house singing this
this gonna be stuck with me all weekend
had to pause and run that back
rewound it before the first verse ended
did not expect to like this as much as i do
came in skeptical, leaving a believer
pleasantly surprised
this what the game been missing
they don't make them like this no more
music like this is why i still dig for new artists
this got soul
you can hear the hunger
you can tell {he} mean every word
this got that old school feel with a new sound
quality over everything
everything about this is right
clean from start to finish
zero complaints from me
nothing to fix here
this one special
timeless record
certified
stamped
approved
big tune
anthem
gas
smooth
my type of music right here
exactly my lane
this the energy i needed today
mood lifted
day made
motivation music
hustle music
cruising music
cookout approved
car test passed
headphone test passed
passed the vibe check
speakers happy
subwoofers thanking you
trunk rattling
this in the whip is dangerous
bass hitting right in the car
salute
respect
well done
bravo, seriously
keep them coming
more of this please
another one for the collection
catalog getting strong
three for three with the last few drops
hasn't missed all year
consistency is scary
^This is honestly one of the best songs I have heard all year.
^I was not familiar with {a} before this, but I am definitely a fan now.
^The production on this is excellent. Whoever engineered it did a great job.
^Really impressive work. The writing stands out to me the most.
^I keep coming back to this one. It gets better every time.
^Great song. I would love to hear this performed live.
^You can hear how much effort went into this. Well done, {a}.
^This deserves far more attention than it is getting.
^I do not usually comment, but this one earned it.
^Excellent record from start to finish.
^The hook has been stuck in my head since yesterday.
^{a} keeps getting better with every release.
^Adding this to my playlist right now. Thank you for sharing it.
^My husband and I have had this on all morning.
^My daughter showed me this and I have to admit, it is very good.
^Solid release. Looking forward to the full project.
^This is a very polished record for an independent artist.
^I appreciate artists who still care about lyrics. Great job.
^What a pleasant surprise this was.
^Wonderful song. The melody is beautiful.
`);
add('music','H',`
[asp] [bad]
[asp] [bad]
nothing here for me
couldn't finish it
made it halfway
lost interest quick
this ain't for me
not my cup of tea
gonna have to pass on this one
hard pass
respectfully, no
i'm good on this
don't see it
don't hear it
whatever yall hearing, i'm not
must be an acquired taste
maybe i'm too old for this
my ears deserve better
give me my three minutes back
waste of a good beat
the beat deserved a better verse
somebody lied to {him}
{his} friends should have said something
{a} need new people in the studio
{a} can do better than this
{a} sound bored on {his} own song
{a} mailed this one in
{a} getting lazy
{a} lost the hunger
{a} been dropping the same song for a year
heard better from soundcloud rappers
heard better in a freestyle
my little cousin got better songs
radio filler
elevator music
background noise
playlist filler at best
B side material
throwaway track
demo quality
needs a remix to save it
no hook, no hit
where's the substance
all vibe no content
style over substance
nothing memorable about it
in one ear out the other
already skipped
won't be revisiting
disappointing
underwhelming
letdown
meh
it's giving nothing
flop
^I wanted to enjoy this, but it did not hold my attention.
^Not a fan of this one. The earlier work was much stronger.
^The mixing needs work. The vocals are buried.
^I do not understand the appeal, to be honest.
^This feels unfinished to me.
^Unfortunately this one is not for me. Maybe the next release.
^It is fine, but nothing about it stands out.
^I expected more after all the promotion.
`);
add('music','S',`
{a} already better than half the people on the radio
{a} would wash most of the freshman list
{a} need a feature from nobody, keep it solo
{a} one co-sign away from being everywhere
{a} deserve the spot they giving to industry plants
put {a} on a festival lineup and watch
sign {a} today or regret it tomorrow
the majors gonna copy this sound in six months
somebody bigger gonna steal this flow, watch
this type of music don't get pushed and we all know why
if this had a tiktok dance it would be number one
this a hit with the right budget
great song, terrible rollout
good song but the title ain't it
cover art don't match how hard this is
real ones know this better than the single everybody posting
this better than the last three songs yall called classics
song of the year and it won't even get nominated
awards mean nothing if this don't get one
the charts are rigged and this is the proof
playlist editors sleeping on purpose
blogs won't post this cause nobody paid them
critics gonna hate it, streets gonna love it
streets love it, internet gonna hate it
older heads will hate this, younger crowd will run it up
this ain't for the tiktok crowd and that's a good thing
lyrics matter again or nah
vibes over bars, and i'm fine with it
bars over vibes every time, this proves it
producer deserve more credit than the artist here
the beat did 70 percent of the work, still a good song
would this still hit with a different beat tho
take the hook off and it's a perfect song
needed a second verse more than a feature
two minutes is too short for a song this good
songs getting shorter every year and it's ruining music
this is good, calling it great is a stretch
7 at best, the comments acting like it's a 10
half of yall ain't even listen all the way through
everybody in here a day one all of a sudden
where was all this love on the last drop
same people praising this ignored {him} last year
yall gonna switch up the second {he} get big
gatekeeping this one, sorry
don't let this go mainstream, they'll ruin it
this the type of song a label would shelve
independent artists eating better than signed ones now
proof you don't need a deal anymore
no features needed, argue with yourself
top three song out this month and the other two ain't close
^I think this is better than most of what is on the charts right now, and I will stand by that.
^Unpopular opinion, but the verses are stronger than the hook.
^It is a good song. I am just not convinced it is as great as everyone here says.
^If a major label artist had released this, it would be everywhere.
^I honestly think people will look back on this as underrated.
`);
add('music','F',`
i need a minute
sat in the driveway to finish the song
missed my exit listening to this
my steering wheel is now a drum set
i'm in the shower giving a full performance
my mirror just watched a whole concert
did the whole verse in my rearview
my dog left the room when i started rapping
my roommate knocked on the wall twice already
landlord gonna raise my rent over this volume
my airpods begged for mercy
phone got hot from the replays
spotify wrapped gonna expose me
i'm not okay
somebody come get me
had to sit down
took my glasses off for this one
face been scrunched for three minutes straight
my eyebrows hurt
walked different after this
left the house feeling six foot five
feel like i can fight a bear
feel like i owe somebody money and don't care
paid my bills late feeling good about it
about to text my boss something crazy
quit my job in my head twice
felt rich for three minutes then checked my account
my bank account don't match this energy
driving a corolla like it's a maybach
turned my honda into a studio
stop light concert, sold out
the lady next to me at the light looked concerned
grandma asked who that is and started nodding
my mom said turn that down then asked for the name
my kid know the hook already and that's a problem
my toddler requested this by name
cat been staring at me since i pressed play
gym got an extra 20 minutes out of me
ran an extra mile by accident
deadlifted my problems to this
cleaned my whole house to this song
washed dishes like a professional
this got me folding laundry aggressively
alexa been playing this against her will
siri tired of me
my uber rating dropped cause i wouldn't stop singing
almost threw my phone when the beat dropped
almost fought the air
shadowboxed in the kitchen
hit the steering wheel so hard the horn went off
`);
add('music','N',`
how old is {a}
is {a} dropping a project this year
who mixed this
who's on the hook
who did the cover art
what's the bpm on this
what studio was this recorded in
any shows coming up
merch link
does {a} have a youtube channel
where can i buy this
is there a slowed version
is there a remix coming
who would sound good on the remix
what's {his} best song besides this
how did i just find out about {a}
how long this been out
this new or am i late
just getting here, what i miss
what's the story behind this song
what does the title mean
is this a single or off a project
what's the album called
anybody seen {him} live
how's the rest of the catalog
similar artists, anybody
if i like this who else should i check
playlist with more like this
saving this for later
bookmarked
listening now
checking this out on my lunch break
came back for a second listen
back again
day two of playing this
still here
^Does anyone know who produced this?
^Is this available on streaming services yet?
^When is the full project expected?
^Where is {a} based? I would like to see a show.
^Could someone recommend more songs by {a}?
`);
add('music','T',`
whoever put me on to this, i owe you lunch
to whoever sent me this, thank you
to the person who posted this, you did the lord's work
sending this to my brother right now
sending this to my sister, she gonna love it
sending this to my cousin, he been asking for new music
group chat getting this immediately
my homeboy been telling me about {a} for months, he was right
my girl been playing {a} all week, now i get it
my man put me on and i apologize for doubting him
bro you were right about {a}
sis you gotta hear this one
twin come listen to this
babe this the song i was telling you about
ma this the artist i was talking about
somebody tag {a} so {he} see the love
tag somebody who need to hear this
tag a friend who sleeping on {a}
show this to anybody who say {genre} is dead
show this to your favorite {rapper}
play this for whoever said nobody make good music anymore
to everybody saying mid, get your ears checked
to the people hating in the comments, drop your song then
whoever disliked this, explain yourself
whoever said skip, we can't be friends
to the person below me, you got good taste
person above me don't know music
if you scrolling the comments, just press play
if you reading this, add it to your playlist
if you here before a million, you got taste
to my future self coming back to this, you still got taste
{a} if you see this, keep going
{a} if you reading this, we need the album
{a} come to my city
{a} drop the video please
{a} don't change nothing
{a} you got a supporter in (texas|ohio|georgia|michigan|florida|new york|california|chicago|the uk|canada|virginia|the carolinas|st louis|memphis|jersey|philly|detroit|houston)
shoutout to the producer, you did that
shoutout to the engineer
shoutout to whoever runs this page for the find
dj, if you reading this, add it to the set
radio people, wake up
playlist curators, where yall at
label people in the comments, we see you
dear algorithm, more like this
note to self, check the rest of the catalog
reminder to come back to this tomorrow
my coworker gonna hear this all shift, sorry in advance
neighbors, i apologize for what's about to happen
^To whoever recommended this, thank you. I really enjoyed it.
^I am sharing this with my son. He will love it.
^{a}, if you read these, please keep making music like this.
`);
/* safe on any news post that is not tragic */
add('uni','F',`
came straight to the comments
the comments never disappoint
my screen time gonna be crazy today
i should be working
reading this on the clock
lunch break entertainment
the internet stays undefeated
what a week and it's only (monday|tuesday|wednesday)
this app is free and that's wild
never logging off
i love it here
wasn't on my bingo card
the timeline is moving fast today
another day another headline
saw this in three group chats before i saw it here
the plot thickens
season finale energy
who writing this season
the writers been busy
roll the credits
to be continued
tune in next week
`);
add('uni','N',`
wait what
hold on, what
is this confirmed
source?
where did this come from
first i'm hearing of this
how am i just seeing this
somebody catch me up
need more details
more info please
full story where
is there a video
any updates
following for updates
following
commenting to come back later
interesting
hmm
well then
oh wow
dang
welp
noted
that's crazy
big if true
^Thank you for the update.
^Is there a link to the full story?
^I had not heard about this until now.
`);
add('uni','S',`
there's more to this story
we only getting half the story
waiting on the other side
believe half of what you see
blogs will post anything for clicks
headline doing a lot of work
read past the headline, people
nobody read the article, just the title
everybody got an opinion and no facts
this gonna age badly
screenshot this comment section for later
bookmark this, it's gonna get worse
people only care when it's trending
selective outrage as usual
if it was somebody yall liked the comments would be different
funny how the story change depending on who posting it
somebody benefiting from this
`);
add('uni','H',`
who cares
slow news day
this ain't news
why is this on my feed
nobody asked
tired of seeing this
enough already
we got bigger problems
post something that matter
old news
this been out for days
late
moving on
scrolling
not interested
couldn't care less
this what we talking about today
the bar for news is in the floor
`);
add('uni','T',`
sending this to the group chat
sending this to my cousin, he needs to see this
tag somebody who called this
whoever told me about this last week, i'm sorry i doubted you
my homegirl called this months ago
to everybody arguing in the replies, go outside
to the person about to type a paragraph, save it
somebody check on the fans
somebody call my mom, she love this type of news
admin, we need the follow up
admin stay with the tea
whoever run this page be on it
thanks for keeping us posted
to whoever commented first, you fast
if you came from the story post, hey
person above me got a point
person below me is wrong, respectfully
everybody in the comments calm down
not yall fighting in the replies
reply section about to be a war zone
`);
add('beef','L',`(this the type of smoke that make good music|somebody had to say it|finally some action in hip hop|been boring lately, we needed this|the gloves off now|no more subliminals, say names|respect for saying it with {his} chest|at least {a} said it out loud|{a} never been scared of nobody|{a} been quiet too long|{a} different when {he} mad|angry {a} make the best music|about to get a classic diss out of this|studio session going crazy tonight|pen about to be on fire|whoever drop first got the advantage|this gonna be a fun week|friday can't come fast enough|setting my alarm for the response|i'm tuned in|locked in for this|front row seat|best thing to happen to hip hop all year|iron sharpen iron)`);
add('legal','L',`(hope {he} got a good team around {him}|hoping for the best outcome|praying the truth come out|not judging until the facts drop|everybody deserve a fair trial|let {him} have {his} day in court|media already convicted {him}|the comments already convicted {him}|don't believe everything you read|been a fan too long to turn on {him} now|still riding with {a}|loyalty don't switch over a headline|keep your head up {a}|thinking about {his} kids|thinking about {his} mother right now|hope the family doing ok|this hurt to see|hate seeing this for {him}|was just starting to win too|come home and get back to the music|music gonna hit different when {he} home|we need {him} home|the city need {him}|whole city behind {a})`);
add('wild','L',`(front row seat to chaos|i have never clicked so fast|did a double take|blinked and missed half of it|rewatching for details|caught something new every replay|the longer you watch the crazier it get|second half even crazier|zero to a hundred real quick|nobody saw that coming|plot twist at the end|the ending tho|jaw on the floor|eyes wide the whole time|hand over my mouth|i yelled|audibly gasped|had to pause and breathe|my whole body tensed up|adrenaline through the phone|this going viral for sure|million views by tomorrow|everybody about to repost this|already seen this five times today and still watched)`);
add('funnyvid','L',`(i needed this today|laughing way too hard at this|woke up and chose laughter|best thing on my feed today|instant mood booster|bad day fixed|cackling|giggling like a child|wheezing|howling|laughed out loud for real|not a fake lol, a real one|laughed before the punchline|lost it at the end|lost it halfway|the first two seconds already had me|every time i think it's over it get funnier|somebody give this person a show|this deserve a million likes|whoever thought of this is a genius|certified funny|goated clip|undefeated video|ten out of ten|sharing this everywhere)`);
add('tour','L',`(counting down the days|marking my calendar|setting a reminder for the sale|refreshing the ticket page already|group chat planning now|taking the whole week off|flying out for this one|driving four hours, don't care|birthday gift to myself|anniversary plans handled|bucket list show|been waiting years to see {him}|finally get to hear the old songs live|hope {he} do the whole first album|bring out the special guests|merch line gonna be crazy|need that tour hoodie|floor seats or i'm staying home|see yall at the barricade|voice gonna be gone the next day)`);
add('general','L',`(good to see|nice to see something positive|that's what's up|respect where it's due|credit where it's due|hard work paying off|blessings on blessings|more blessings to {a}|nothing but growth|grown moves only|chess not checkers|playing the long game|setting an example|the culture need more of this|young artists take notes|this how you move|flowers while {he} here|been deserved this|overdue recognition|keep shining {a}|sky the limit|the glow up is real|from the bottom to this, inspiring|everybody eat when one of us win)`);
/* ------------------------------------------------ video games, beats, history, indie artists */
G.gasp=`the graphics|the gameplay|the story|the map|the online|the servers|the soundtrack|the controls|the campaign|the multiplayer|the physics|the loading times|the character creator|the open world|the combat|the side missions|the cutscenes|the voice acting|the gunplay|the driving|the customization|the boss fights|the ending|the trailer|the lighting|the animations|the frame rate|the menus|the ai|the career mode`.split('|');
G.gver=`look unreal|is smooth as butter|is the best in the series|got me hooked|feel next gen for real|is a huge step up|is so detailed|is worth the price alone|is addictive|blew me away|is on point|feel perfect|is clean|is crazy good|is what i been asking for|had me smiling like a kid|is top tier|is a big improvement`.split('|');
G.gbad=`look dated|is clunky|is a downgrade|is broken|feel unfinished|is laggy|is a mess|is boring|ruined it for me|is copy and paste|feel cheap|got worse somehow|is stuck in 2015|is full of bugs|is a joke|need a patch already|feel rushed|is the worst in the series`.split('|');
G.basp=`the drums|the 808s|the melody|the bass line|the sample chop|the hi hats|the bounce|the swing|the snare|the kick|the piano|the keys|the strings|the low end|the mix|the arrangement|the drop|the intro|the switch up|the synths|the chords|the percussion|the loop|the bridge section|the outro`.split('|');
add('game','L',`
[gasp] [gver]
[gasp] [gver]
[gasp] [gver]
(game of the year, easy|day one buy for me|pre ordered already|taking a week off work for this|cancel my plans|been waiting years for this|childhood coming back|they actually listened to the fans|finally a game that respect my time|finally a finished game at launch|worth every dollar|worth full price|already 40 hours in|can't put the controller down|one more mission turned into 4am|haven't slept since it dropped|this what gaming supposed to feel like|reminds me why i love games|instant classic|easy 10 out of 10|masterpiece and i don't say that often|the devs cooked|devs deserve a raise|studio redeemed themselves|best in the series|better than the last one by far|trailer gave me chills|trailer alone better than most games|the hype is real|lived up to the hype|exceeded every expectation|my whole squad getting this|squad up tonight|split screen memories unlocked|couch co op is back|soundtrack going crazy too|whoever picked the soundtrack deserve a bonus|they put real hip hop in the soundtrack, respect)
{a} (is a masterpiece|about to take over my whole year|got me acting like a kid again|is everything i wanted|about to break the internet|is the reason i bought a console|is back and better|still the king|never disappoint|got the best community|deserve every award|is what a sequel should be)
^This looks fantastic. I will be buying it on release day.
^The developers clearly put a lot of care into this.
^I am very impressed with how polished this is.
^I have been playing games for twenty years and this is one of the best I have seen.
`);
add('game','H',`
[gasp] [gbad]
[gasp] [gbad]
[gasp] [gbad]
(not paying 70 dollars for this|wait for a sale|wait for the reviews|never pre order, people|another unfinished game|launch gonna be a mess, watch|servers gonna be down day one|bugs on bugs|same game as last year with a new number|copy and paste sequel|they got lazy|dev team lost the plot|the old ones were better|nostalgia bait|cash grab|battle pass simulator|pay to win garbage|micro transactions in a full price game is crazy|looks like a mobile game|ps3 graphics in 2026|downgraded from the trailer|trailer lied again|refunded already|uninstalled after an hour|returned it the same day|bored after two missions|dead game in three months|nobody gonna be playing this by summer|overhyped again|biggest letdown of the year|my backlog more interesting than this|gaming is cooked|this why i stick to old games|skip)
{a} (fell off after the last update|been dead for years|is carried by nostalgia|ain't been good since the second one|is a scam at this price|lost me at the battle pass|is the most overrated game out|needed another year in development|is just a reskin|community is the worst part)
^I am disappointed. This does not look ready for release.
^The price is too high for what is being offered.
^I will wait for reviews before spending money on this.
`);
add('game','S',`
(graphics don't matter if the gameplay trash|gameplay over graphics every time|story games better than online games and it's not close|single player gaming is dead and online killed it|game pass is ruining how people value games|80 dollar games is the reason piracy coming back|exclusives are bad for gaming, there i said it|console wars is the dumbest argument on the internet|pc players act like they better than everybody|reviewers get paid to give 9s|review scores mean nothing anymore|review bombing is just fans being honest|yall complain then buy it anyway|same people crying gonna pre order|gamers are the most entitled fans alive|developers get blamed for what publishers decide|crunch is why games come out broken|delays are a good thing, let them cook|a delayed game is eventually good, a rushed one is bad forever|remakes are lazy and yall keep rewarding it|we need new ideas not another remaster|the old one only seem better cause you was a kid|nostalgia got yall lying about old games|difficulty sliders don't ruin nothing, relax|easy mode ain't hurting nobody|this wouldn't get half the hate with a different name on the box|streamers decide what's popular now, not players|influencers got early copies so of course they love it|game of the year or just the loudest fanbase|microtransactions only exist cause yall keep buying skins|sports games been the same for ten years and still sell|violence in games ain't the problem, parenting is|kids shouldn't be on this game, parents need to read the rating|rap in game soundtracks used to be way better|licensed music made the old ones classic)
{a} (is overrated and yall not ready to hear it|was never as good as people remember|is better than the game everybody compare it to|fans can't take criticism|deserve the hate it get|don't deserve the hate it get|peaked years ago|only popular cause of streamers)
`);
add('game','F',`(my sleep schedule is already ruined|my boss about to get a sick email|coughing practice started|telling my girl i'm busy for the next three months|my wallet saw the price and fainted|my backlog watching me buy another game|bought it, gonna play it in two years|downloading for six hours to play for one|100 gig update just to fix a hat|my console sound like a jet engine|controller about to meet the wall|rage quit speedrun|died to the tutorial boss|been on the character creator for two hours|spent more time in the menu than the game|my k d is a war crime|carried by my little cousin again|lobby full of twelve year olds talking crazy|got cooked by a kid named something i can't repeat|blaming lag every time|it's the controller, not me|my thumbs filed a complaint|grown man yelling at a tv, that's me|wife said it's her or the game, i'll miss her|the npc got more personality than me|side quests over my real responsibilities)`);
add('game','N',`(release date|what platforms|is it on game pass|crossplay or nah|how many gigs|how much is it|is there a physical copy|offline mode|is there split screen|can you play solo|how long is the campaign|is it open world|any dlc planned|worth it at full price|who's on the soundtrack|is the online free|pc port when|switch version|does progress carry over|what's the rating|early access when|is there a demo|any gameplay footage yet|who developing this one|same studio as the last one)`);
add('game','T',`(sending this to the squad|tagging my duo|group chat, we playing tonight|bro we getting this day one|somebody tell my cousin it finally dropped|to my boys who said it was cancelled, look|whoever said this would never come out, apologize|to the devs, thank you|to the devs, fix the servers|dear publisher, lower the price|to everybody pre ordering, yall the problem|to my wife, i'm sorry in advance|somebody gift me this|who trying to run it tonight|add me, i need a squad|looking for a team, no sweats|to the person who spoiled the ending, i hope your controller drift|if you still play the old one, respect|pc players stay out the lobby please|to whoever picked the soundtrack, good ears)`);
add('beats','L',`
[basp] [ver]
[basp] [ver]
[basp] [ver]
(this beat need a verse on it asap|somebody gonna make a hit on this|i can already hear the hook|freestyling to this in my car|wrote 16 bars in ten minutes to this|this beat writing the song for me|producer tag alone hard|whoever buy this first is winning|need the stems|need this exclusive|leasing this tonight|how much for the exclusive, i'm serious|this deserve a big artist on it|placement worthy|this a placement waiting to happen|type beat channels can't touch this|sound like a movie score|sound expensive|headphones on, eyes closed|this instrumental don't even need vocals|could listen to this with no rapper on it|study music and gym music at the same time|loop this for an hour|been running this instrumental all day|the kind of beat that make you rap better|instant inspiration|got my pen moving|this what a real producer sound like|no loops from a pack, you can tell|sound selection crazy|mixing on this is clean|simple but it hit|less is more and this proves it)
{a} (on the beat and it show|don't miss behind the boards|got the hardest drums out|is the most slept on producer|need a producer of the year nod|been cooking lately|got a sound nobody else got|deserve more placements)
^The arrangement on this is excellent. Very professional work.
^I produce as well, and the drum programming here is impressive.
`);
add('beats','H',`
[basp] [bad]
[basp] [bad]
(sound like every type beat on youtube|same melody loop everybody using|stock sounds|preset beat|heard this exact loop in five other beats|drums too quiet|808 clipping|mix is muddy|too busy, no room for a rapper|too empty, nothing going on|two bar loop for three minutes|no bounce|no switch up, got boring|nobody rapping on this|tag is louder than the beat|too many tags|sound like a ringtone|sound like 2016|dated sound|off key melody|needs a real mix|generic trap beat number one million|ai could make this|made in ten minutes and it show)
`);
add('beats','S',`(producers deserve half the song, period|the beat is 80 percent of a hit and producers get 5 percent of the credit|rappers nothing without producers|type beat producers are real producers, argue|using loops ain't producing|using loops is fine, the greats sampled|sampling is art, not stealing|sample snitching need to stop|ai beats gonna take over and nobody ready|ai can't replace feel|fl studio or nothing|the daw don't matter, the ear do|beats getting simpler cause rappers can't ride hard ones|rappers ruin good beats every day|this beat better than whatever rapper end up on it|free beats killed the market|stop giving beats away for free|producers charging too much for mp3 leases|exclusive rights should be standard|producer tags are corny now|every producer need a tag, don't argue|drumless beats overrated|boom bap never left|melody loops made everybody sound the same)`);
add('beats','F',`(i can't rap but i'm about to try|wrote a verse, deleted it, the beat deserve better|my freestyle did not do this justice|rapping in my head and still off beat|made the stank face with no vocals on it|my neck hurt and nobody even rapped yet|beat so hard i forgot there's no words|caught myself humming a hook that don't exist|my speakers asked what's my problem|the 808 moved my furniture|neighbors think i'm a producer now|played this for my dog and he started nodding|downloaded fl studio after this then closed it|respect to producers, i tried once and made a doorbell sound)`);
add('beats','N',`(what's the bpm|what key is this in|what daw|what vst is that melody|is that a sample|what drum kit|is this for sale|price for a lease|is the exclusive still available|stems included|where can i buy this|free for non profit|do you take custom orders|who's this for|who should hop on this|what's the beat called|tutorial on the drums please|how long this take to make)`);
add('beats','T',`(rappers in the comments, who want this|somebody tag a rapper who need this|to whoever buy this, don't waste it|producers in here, how he do that bounce|{a} check your dms|{a} drop the kit|{a} teach a class|sending this to my engineer|sending this to my artist right now|to my producer, step it up|shoutout to every producer reading this|artists stop sleeping on this page|if you rap, this your sign|my homie need to hear this before he book studio time|to the rapper who get this, we need the song asap)`);
add('history','L',`
(they don't make them like this anymore|golden era|this era was different|what a time for hip hop|music had soul back then|i remember exactly where i was|this took me back|my whole childhood right here|high school memories unlocked|my older brother put me on to this|my pops used to play this every sunday|wore the tape out|had the cd in the car for a year straight|bought this the day it came out|still got the vinyl|still in rotation to this day|aged like fine wine|timeless|still sound fresh|ahead of its time|changed the game forever|paved the way for everybody after|the blueprint|respect the pioneers|give the legends their flowers|real hip hop history|the culture needed this reminder|young people need to see this|this should be taught in school|love when this page post history|more history posts please|learned something today|never knew that, thanks for posting|crazy how long ago that was|time flying)
{a} (changed everything|is forever|never got enough credit|influenced everybody you listen to now|was ahead of the whole game|is a legend, no debate|is the reason i love hip hop|still untouchable|deserve a statue|is top five of all time, easy)
^Thank you for posting this. People forget how important this was.
^This was a defining moment for the culture.
^I was there for this era, and it truly was special.
`);
add('history','H',`
(overrated then, overrated now|nostalgia got yall lying|it wasn't that good, yall was just young|didn't age well|sound dated now|couldn't sit through this today|respect it but can't listen to it|old heads need to let it go|every era got trash, yall just forgot the bad songs|tired of hearing how the 90s was better|nobody under 30 care about this|let the past stay in the past|this the same story they post every year|history lesson nobody asked for|hip hop moved on|classics get called classics too easy)
{a} (is overrated, sorry|got carried by the era|wouldn't survive today|been living off one album|is not top ten and never was|fans act like nobody else existed)
`);
add('history','S',`
(the old days wasn't better, you was just younger|today's artists couldn't last a week in that era|that era couldn't keep up with today's work rate|lyricism died when streaming started|the south saved hip hop and new york still mad|the west coast never got its full credit|the midwest been the most slept on region forever|women in rap been carrying since day one and got written out|producers of that era deserve more credit than the rappers|the labels robbed that whole generation|half those classics would get cancelled today|hip hop was better when it was regional|the internet ruined the mystery of the artist|mixtape era was the real peak|blog era was better than the golden era, i said it|ringtone era get too much hate|top five lists are just age tests|your goat depend on what year you was 16|history written by whoever got the documentary|this story been cleaned up, the real one is wilder|who really started it depends who you ask|the real pioneers never got paid|biggest what if in hip hop history|if this dropped today it would flop|if this dropped today it would still go number one)
{a} (vs anybody from today ain't close|would get exposed today|is better than your goat|got erased from the conversation on purpose|is the most important and least credited)
`);
add('history','F',`(my knees hurt just remembering this|i'm old, don't remind me|not this being 20 years ago|that can't be right, check the math|i still think 2010 was five years ago|had this on a burned cd with sharpie on it|downloaded this off limewire and got a virus|my ringtone for a whole school year|taped this off the radio with the dj talking over it|my mom threw this cd out the window|got in trouble for knowing every word|baggy jeans flashback|the outfits tho|we really dressed like that|tall tees era was a time|my durag collection remember this|the video budget was a honda civic|unc status confirmed|kids in the comments like who is this)`);
add('history','N',`(what year was this|how old was {a} here|who produced this back then|what album is this from|where was this recorded|is there a documentary on this|where can i watch the full interview|who else was there|what happened after this|what label was this under|was this before or after the first album|who's that in the background|is this the original version|what was number one that week|any more photos from this day|part two please)`);
add('history','T',`(showing this to my son so he know real music|sending this to my pops, he gonna love it|sending this to my uncle who swear he was there|to the young ones, go listen to the whole album|to the old heads, yall was right about this one|kids, ask your parents about this|tag somebody who remember this|whoever was outside for this era, speak up|to my day ones who had the mixtape, we old|somebody tell the youngins who this is|my big cousin put me on, forever grateful|to whoever kept the footage, thank you|admin, more of these|shoutout to everybody who bought it in stores|if you know every word, your back hurt too)`);
add('indie','L',`
(independent and winning|no label, no problem|doing it without a machine behind {him}|this what ownership look like|own your masters|built it from the ground up|self made for real|the grind is showing|consistency paying off|been watching the come up, proud|small artist, big talent|big artist sound on a small budget|underground won't hold {him} long|about to outgrow the underground|about to be a household name|get in early on this one|remember where you heard it first|this page stay finding real talent|new favorite artist unlocked|following immediately|going through the whole catalog tonight|adding everything to my playlist|booking {him} for a show asap|need to see this live|support independent music|buy the merch, stream the music|put your city on|the hunger is different when you independent|you can hear the work ethic|nobody handed {him} nothing|future star|next up for real|one song away|talent can't be denied|quality rising every drop)
{a} (is the one to watch|about to have a moment|deserve a bigger audience|is proof you don't need a label|got the whole city behind {him}|been working, it show|is a problem|next up, no question|got star quality|is built different)
^It is great to see independent artists getting this kind of recognition.
^I just listened to three songs by {a}. Very impressed.
`);
add('indie','H',`
(another one|everybody a rapper now|never heard of {him}|who|not seeing the hype|sound like everybody else coming up|need more work before the spotlight|not ready yet|raw talent but no songs|potential ain't enough|give it a few years|paid for this post probably|promo post|page will post anybody now|my cousin rap better and he got 12 followers|independent cause no label wanted it|there's a reason nobody signed {him}|next up to what|won't remember the name next month|one hit away from one hit)
{a} (ain't it|need better beats|need a real engineer|sound unfinished|got a long way to go|is getting hyped too early)
`);
add('indie','S',`(independent artists outworking the whole industry right now|labels are scared of artists like this|signing a deal in 2026 is a mistake|a deal would ruin {him}|a deal would take {him} to the next level, be real|independent is cool till you need a budget|ownership don't mean much with no audience|every artist say they independent till the check come|most independent artists got a silent investor, don't be fooled|the algorithm is the new label|tiktok is the new a and r|numbers matter more than talent now|talent with no marketing is a hobby|marketing with no talent is the whole industry|yall say support indie artists then stream the same five people|local support is a myth, your own city hate first|blogs only post independent artists who pay|being underground ain't a personality|underrated or just not that good, be honest|better than half the signed artists and making a tenth of the money|the next star coming from a small page like this, not a label|industry plants be calling themselves independent|real independent artists can't afford this much promo|if {he} blow up yall gonna say {he} changed)`);
add('indie','F',`(me acting like {his} manager after one song|about to claim i'm from {his} city|telling everybody i knew {him} first|day one fan as of four minutes ago|already drafting my i told yall post|gonna be insufferable when {he} blow up|bought merch before the song ended|my mom asked why i'm promoting somebody i never met|street team volunteer reporting for duty|unpaid intern for {a} starting today|gatekeeping failed, i told everybody|posting this like i get a commission)`);
add('indie','N',`(where is {a} from|how long {he} been making music|what's the best song to start with|is there an album out|any shows coming up|where can i stream this|is {he} on all platforms|who produce for {him}|what city|how old is {a}|any features coming|what's the ig|is there merch|who put you on to {him}|what song is in the post|is {he} touring this year)`);
add('indie','T',`({a} keep going, we watching|{a} don't sign nothing without a lawyer|{a} come perform in my city|{a} drop the tape|to the labels in the comments, back off|to the labels in the comments, hurry up|a and rs wake up|tag somebody who need a new artist to listen to|sending this to my cousin who say there's no good new music|to everybody saying who, press play first|show love to the small artists, it's free|whoever run this page, keep spotlighting indies|bookers, get {him} on a stage|djs, this the one to break|to my city, we got one|playlist people, add {him})`);
add('music','N',`(this is weird and i think i like it|strange song, can't stop playing it|don't know what genre this is but ok|experimental and it work|weird in a good way|took three listens to get it|different from what's out, i respect it|not sure how i feel yet)`);
/* ------------------------------------------------ celebrity + relationship posts (blog style) */
add('gossip','L',`
(love this for {him}|{he} look happy and that's all that matter|happy looking good on {him}|glowing|unbothered and thriving|living {his} best life|as {he} should|mind the business that pay you, {a} doing fine|let {him} live|{he} don't owe nobody an explanation|protect {his} peace|{he} been through enough, let {him} be happy|good for {him}, period|here for it|rooting for {him}|this made me smile|we love to see growth|soft life looking good|booked and busy|{he} look amazing|the glow up real|aging backwards|whatever {he} doing, it's working|grown and minding {his} own|{he} handled that with class|classy response|took the high road, respect)
{a} (stay winning|been that|never miss with the looks|is unproblematic and i love it|deserve all the love|can do no wrong in my book|always keep it real|stay unbothered)
`);
add('gossip','H',`
(why do we need to know this|some things should stay private|oversharing again|chasing headlines again|the attention seeking is loud|log off|put the phone down|embarrassing|grown and still doing this|tired of this storyline|new week same drama|famous for being messy|do something productive|we don't care, pay your taxes|this ain't cute|doing too much as always|pick me behavior|the internet ain't your diary|go to therapy, not live|second hand embarrassment|weird behavior)
{a} (stay in some mess|love the drama|need a publicist|need a hobby|is always the victim|can't stay out the blogs|been falling off|is exhausting)
`);
add('gossip','S',`(pr relationship, calling it now|contract couple|this won't last six months|something to promote, watch|both of them wrong|it's always the ones preaching loyalty|the ex was right the whole time|we only ever hear one side|the receipts gonna come out|somebody lying and the timeline don't add up|yall was just dragging {him} last week|the internet forgive whoever they find attractive|if the roles was reversed the comments would be different|double standards in these comments is crazy|famous people problems ain't real problems|they post it then ask for privacy|you can't sell your life then complain people watching|blogs build them up to tear them down|money can't buy peace clearly|the kids the ones who suffer from this being public|social media ruined relationships|team nobody|i believe {him}, sorry|i don't believe a word of it)`);
add('gossip','F',`(i know the group chat in shambles|the ex watching this like|somebody's publicist just woke up in a sweat|the notes app apology loading|not the soft launch|hard launch and all|i need the tea hot not lukewarm|auntie in the comments ready|the blogs eating good today|sipping my tea quietly|i'm too invested in people i never met|why do i care, i got rent due|me reading this like it's my family business|adding this to my list of things that ain't my business but i'm here|the way i ran to the comments|comments section my favorite show|getting my popcorn and my bonnet|i need a seat and a snack|chile anyway|the mess, i love it here)`);
add('gossip','N',`(wait they was together|since when|what happened to the last one|who is that with {him}|how long this been going on|is this old|what did {he} say exactly|where's the video|what's the backstory|did {he} respond yet|who posted first|are they still together|is this confirmed or a rumor|what i miss|how old is {he} again|who's the other person)`);
add('gossip','T',`(sis did you see this|sending this to my bestie immediately|group chat wake up|tagging my cousin, we called this|my coworker gonna gag when she see this|whoever had this on their prediction list, come collect|to the ex, we see you watching|to everybody who said it wouldn't last, well|to the fans fighting in the replies, they don't know yall|auntie come get your niece|admin you messy for this caption|admin stay posting at the right time|roommate talk at 9, bring snacks|somebody check on {his} fans|not me sending this to my mama)`);
/* short good ones that fit any upbeat post */
add('uniL','L',`(love this|love to see it|this is it|big fan of this|huge W|no complaints|this what i like to see|so good|too good|great stuff|this is fire|top tier|elite|A1|never disappoints|needed this today|here for this|all the way here for it|yes to all of this|more of this|keep it coming|this right here|say less|facts|real|period|big facts|respect|salute|nothing but love|ten out of ten|undefeated|classic|iconic|legendary|goated|different|special|quality|good stuff|well deserved|about time|finally|i'm in|sold|count me in|sign me up|chef's kiss|no notes|flawless|beautiful|this hit|love everything about this)`);
T.shock=T.wild;T.local=T.general;
/* lines built from details in the story itself: the place, money, years, age, "again" */
const FACT={
N:bank(`(what part of {city}|not {city}|where in {city} was this|anybody from {city} know more|{city} people, what's the word|{city} in the news again)
({money}? for real|{money} is a lot of money|where {he} get {money} from|{money} just like that|{money}, wow)
({yrs} years|{yrs} years is a long time|{yrs} years, wow|{yrs} whole years)
({age}, wow|only {age}|{age} is young)
{again} (again?|not again|how many times is this now|another one|we been here before)`),
S:bank(`(it's always {city}|something in the water in {city}|{city} been wild lately|{city} can't catch a break)
({money} and still not happy|{money} could change a whole neighborhood|imagine what {money} could do for the community|{money} is nothing to them, that's the crazy part)
({yrs} years for that while others walk free|{yrs} years ain't enough|{yrs} years is too much, be real|{yrs} years and the real ones still outside)
{again} (at this point it's a pattern|fool me once, this is the third time|this feel like a rerun|same story different month)`),
F:bank(`{again} (at this point it's a series|season two already|they running this back like a rerun|i've seen this episode before)
({money}, meanwhile i'm checking my account before i buy gas|{money} and i'm over here splitting a pizza three ways|i can't even picture {money})
({city} never boring|{city} stay giving us content|leave it to {city})`),
sad:bank(`({age} is way too young|only {age}, heartbreaking|gone at {age}, no words|{age}, that's a whole life ahead)
(praying for {city} tonight|{city} hurting right now|{city} lost a real one|sending love to everybody in {city})`)};
const CITY=/\b(atlanta|houston|chicago|detroit|new york|nyc|brooklyn|the bronx|harlem|queens|los angeles|compton|oakland|miami|memphis|dallas|new orleans|philly|philadelphia|baltimore|washington dc|st\.? louis|charlotte|cleveland|milwaukee|las vegas|vegas|toronto|london|jacksonville|baton rouge|nashville|birmingham|new jersey|newark|boston|seattle|phoenix|denver|minneapolis|kansas city|indianapolis|columbus|cincinnati|pittsburgh|buffalo|sacramento|san francisco|the bay|texas|florida|georgia|california|ohio|michigan|louisiana|alabama|mississippi|tennessee|north carolina|south carolina|virginia|maryland)\b/i;
function facts(t){t=String(t||'');const f={},c=t.match(CITY),m=t.match(/\$\s?\d[\d,.]*\s?(million|billion|mil|m|k|b)?\b/i),y=t.match(/\b(\d{1,3})\s*(?:years?|yrs?)\b(?![- ]old| ago)/i),a=t.match(/\b(?:at|aged?)\s(\d{2})\b|\b(\d{2})[- ]years?[- ]old/i);
 if(c)f.city=c[1].toLowerCase().replace(/\b[a-z]/g,x=>x.toUpperCase()).replace(/^The /,'the ').replace('Nyc','NYC').replace(' Dc',' DC');if(m)f.money=m[0].replace(/\s+/g,' ').trim();if(y&&+y[1]>0)f.yrs=y[1];if(a)f.age=a[1]||a[2];if(/\b(again|another|second time|third time|once more|yet another)\b/i.test(t))f.again=' ';return f}
/* emojis only: fire for songs, the right faces for everything else */
const EONLY={music:['🔥','🔥','🔥','🔥','💯','🐐','😮‍💨','🙌','‼️','🎯','🚀','🔊','👏','😤','🥶','⚡','💥','🏆','👑'],rnb:['😍','🥹','😩','❤️‍🔥','🔥','🔥','💯','🙌','✨'],funnyvid:['😭','💀','😂','🤣'],wild:['😳','🤯','😱','👀','💀','😭'],beef:['🍿','👀','🔥','😳','🥊'],legal:['👀','😳','🤦','😬'],tour:['🔥','🙌','🎟️','😤','🎤'],general:['👀','🔥','👏','💯','😳'],rip:['🙏','🕊️','💔','😔'],hurt:['🙏','🙏🏾','😔','❤️‍🩹'],game:['🎮','🔥','🎮','💯','👀','🙌','😤','🕹️'],history:['🔥','🐐','👑','🙌','💯','📼','🙏','🏆']};EONLY.beats=EONLY.indie=EONLY.music;EONLY.shock=EONLY.wild;EONLY.local=EONLY.general;EONLY.gossip=['👀','😭','☕','🍵','💀','😍','🔥','👏'];
function emo(S){const set=EONLY[S.topic]||EONLY[FAMILY(S.topic)==='music'?'music':'general'],sad=SAD(S.topic),a=pick(set),r=Math.random(),n=k=>1+Math.floor(Math.random()*k);
 if(r<.45)return a.repeat(n(sad?3:8));const b=pick(set);if(b===a)return a.repeat(n(6));
 if(r<.85)return a.repeat(n(sad?2:5))+b.repeat(n(sad?2:3));const c=pick(set);return a.repeat(n(3))+b.repeat(n(2))+(c!==a&&c!==b?c.repeat(n(2)):'')}
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
const UPBEAT=['beats','history','indie','game','general','gossip','tour','local'];
function pool(topic,tone){if(SAD(topic))return [[T[topic].L,1]];
 const m=T.music[tone]||[],x=(T[topic]||{})[tone]||[],u=T.uni[tone]||[];
 if(topic==='rap')return [[m,1]];
 if(FAMILY(topic)==='music')return x.length?[[x,.35],[m,.65]]:[[m,1]];
 const P=[];if(x.length)P.push([x,.65]);
 if(u.length&&!['beats','history','indie'].includes(topic)&&(tone!=='S'||['general','beef','legal','gossip','local'].includes(topic)))P.push([u,.25]);
 if(tone==='L'&&UPBEAT.includes(topic))P.push([T.uniL.L,.2]);return P.length?P:[[[],1]]}
const wpick=P=>{let r=Math.random()*P.reduce((a,x)=>a+x[1],0);for(const [l,w] of P){if(r<w)return pick(l);r-=w}return pick(P[0][0])};
function alt(t){let g=0;while(g++<90){const m=t.match(/\[(\w+)\]|\(([^()]*)\)/);if(!m)break;const v=m[1]?pick(G[m[1]]||['']):pick(m[2].split('|'));t=t.slice(0,m.index)+v+t.slice(m.index+m[0].length)}return t}
const PRO={him:{he:'he',him:'him',his:'his',bro:['bro','dude','my boy','he','bro really'],himx:['him','that guy','the one']},her:{he:'she',him:'her',his:'her',bro:['sis','she','she really','shorty'],himx:['her','that girl','the one']},
 they:{he:'they',him:'them',his:'their',bro:['they','the gang','they really'],himx:['them','the ones']}};
function fill(tpl,S){let t=alt(tpl.replace(/^\^/,'')),bad=false;const P=PRO[S.pro],rnb=S.topic==='rnb';
 t=t.replace(/<([^|>]*)\|([^>]*)>/g,(m,a,b)=>S.pro==='they'?b:a);
 t=t.replace(/\{(\w+)\}/g,(m,k)=>{let v;
  if(S.f&&S.f[k])v=S.f[k];else if(k==='a')v=S.a;else if(k==='a2')v=S.a2;else if(k==='s')v=S.s;
  else if(k==='rap')v=rnb?'singing':'rapping';else if(k==='rapper')v=rnb?'singer':pick(['rapper','artist']);else if(k==='bars')v=rnb?pick(['the lyrics','the writing','the pen']):pick(['the bars','the lyrics','the pen']);
  else if(k==='genre')v=rnb?pick(['r&b','real music']):pick(['rap','hip hop','real music','the underground']);
  else if(k==='his')v=P?P.his:(S.a?S.a+"'s":'');else if(k==='bro'||k==='himx')v=P?pick(P[k]):(k==='himx'?pick(['the one','that one']):S.a);
  else if(k==='he'||k==='him')v=P?P[k]:S.a;
  if(!v)bad=true;return v||''});
 if(bad)return null;
 return t.replace(/\s+/g,' ').replace(/ ([,?!:])/g,'$1').replace(/^[,:]\s*/,'').replace(/[,:]\s*$/,'').trim()}
const hasWord=t=>/[a-z]/i.test(t);
/* type it the way people type. fx remembers the longer openers and closers already used in this batch */
function style(t,tone,S,tail,fx,proper){if(!hasWord(t))return t;const sad=SAD(S.topic),fam=FAMILY(S.topic),tn=PRE[tone]?tone:'L';
 let E=S.topic==='hurt'?EMO.hurt:sad?EMO.sad:tn==='L'?(fam==='music'?(S.topic==='rnb'?EMO.rnb.concat(EMO.L):EMO.L):S.topic==='legal'?EMO.support:EMO.newsL):EMO[tn];
 if(S.topic==='funnyvid'&&tn==='L')E=EMO.F;if(S.topic==='wild'&&tn==='L')E=['😳','😭','💀','🤯','😱','👀'];
 if(proper){t=t[0].toUpperCase()+t.slice(1);if(R(.3))t=t.replace(/\.$/,'');if(R(.1))t+=' '+pick(E);return t}
 const pre=PRE[tn],suf=SUF[tn],once=x=>!/ /.test(x)||(!fx.has(x)&&(fx.add(x),true));
 if(!sad&&R(tail?.05:.13)&&t.length<70){const p=pick(pre);if(!new RegExp('^('+pre.join('|')+')\\b','i').test(t)&&!/^(be |real talk|unpopular|hot take|might|am i|i'm the|ok|okay|alright|oh|yeah|if |which|who|what|when|where|why|how|is |not |no |sorry|whoever|somebody|someone|to |tag|show|play|sending|shoutout|dear|note|reminder)/i.test(t)&&once(p))t=p+' '+t}
 const q=/\?$/.test(t);
 if(!sad&&!q&&!tail&&R(.15)&&t.length<70){const x=pick(suf);if(!new RegExp('\\b'+x+'$','i').test(t)&&once(x))t=t+' '+x}
 if(!q&&tone==='N'&&/^(who|what|when|where|why|how|is|are|did|has|does|do|can|any|anybody|anyone|which)\b/i.test(t)&&R(.55))t+='?';
 if(R(.42))SPEAK.forEach(([r,w,p])=>{if(R(p))t=t.replace(r,w)});
 if(R(.5))t=t.replace(/(\w)'(\w)/g,'$1$2');
 const r=Math.random();
 if(r<.62)t=t.toLowerCase().replace(/^(big |huge |)([wl])\b(?= (for|move|take|news)|$)/,(m,a,b)=>a+b.toUpperCase());
 else if(r<.69&&t.length<26&&!sad&&tone!=='N')t=t.toUpperCase();
 else t=(t[0].toUpperCase()+t.slice(1)).replace(/\bi\b/g,'I').replace(/\bi'm\b/gi,"I'm").replace(/\bim\b/g,'Im');
 if(!sad&&!/\?$/.test(t)&&R(.06)){const m=t.match(/([a-z]{3,})$/i);if(m&&!/(fr|ngl|tbh|idc|lol|smh)$/i.test(t))t=t+t.slice(-1).repeat(2+Math.floor(Math.random()*4))}
 if(!/\?$/.test(t)&&R(.05)&&!sad)t+=tn==='H'?'...':tn==='L'||tn==='F'?'!!':'';
 if(R(sad?.5:tone==='N'?.12:.4))t+=' '+pick(E);
 return t}
/* ---- never twice for the same subject (kept in this browser) ---- */
const hash=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)};
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');
let USED=null;const loadUsed=()=>{if(USED)return USED;try{USED=new Set((localStorage.getItem('cmt_used')||'').split(',').filter(Boolean))}catch(e){USED=new Set()}return USED};
const saveUsed=()=>{try{let a=[...USED];if(a.length>40000)a=a.slice(-40000);localStorage.setItem('cmt_used',a.join(','))}catch(e){}};
const EXTRA=()=>{const o={L:[],H:[],S:[],F:[],N:[],T:[],E:[]};let v='';try{v=localStorage.getItem('cmt_extra')||''}catch(e){}v.split('\n').map(x=>x.trim()).filter(Boolean).forEach(l=>{const k={'+':'L','-':'H','!':'S','?':'N','@':'T'}[l[0]];o[k||'F'].push((k?l.slice(1):l).trim().replace(/\bNAME\b/g,'{a}').replace(/\bSONG\b/g,'{s}'))});return o};
const AIL={};/* lines the small AI wrote, by subject key then tone */
/* no phrase twice in one batch: every pair of meaningful words and every three-word run is used once,
   and no single word shows up more than a few times */
const STOP=new Set(`a an the this that these those i im ive me my we us our you u ur your yall he she they his her their him them it its is was are be been am were do did does dont didnt doesnt aint cant wont not no nah to of and or but in on at by for from with wit about bout like just really so too very more most some any every even still only as if than then there here now up out all one get got gonna gotta wanna will would could should need want have has had who what when where why how which yeah ok okay oh`.split(' '));
function grams(core,S){let t=' '+core.toLowerCase().replace(/['’]/g,'')+' ';[S.a,S.a2,S.s].filter(Boolean).forEach(n=>{t=t.split(n.toLowerCase().replace(/['’]/g,'')).join(' § ')});
 const w=t.replace(/[^a-z0-9§ ]+/g,' ').split(/\s+/).filter(Boolean),c=x=>x!=='§'&&!STOP.has(x),g=[],words=[];
 w.forEach((x,i)=>{if(c(x))words.push(x);if(i&&c(x)&&c(w[i-1]))g.push(w[i-1]+' '+x);if(i>1&&x!=='§'&&w[i-1]!=='§'&&w[i-2]!=='§'&&(c(x)||c(w[i-1])||c(w[i-2])))g.push(w[i-2]+' '+w[i-1]+' '+x)});return {g,words}}
/* S: {topic, a, a2, s, pro, k}. mix: {L,H,S,F,N,T,E} weights. Returns [{t,tone}] */
function make(S,n,mix){const used=loadUsed(),sk=norm([S.topic,S.a,S.s,S.k].join('|')),sad=SAD(S.topic),out=[],seen=new Set(),GR=new Map(),WC=new Map(),fx=new Set(),extra=EXTRA(),ai=AIL[sk]||{};
 const m=sad?{L:92,E:8}:mix,tones=['L','H','S','F','N','T','E'].filter(k=>m[k]>0),tot=tones.reduce((a,k)=>a+m[k],0)||1;
 const want={},got={},miss={};tones.forEach(k=>{want[k]=Math.round(n*m[k]/tot);got[k]=0;miss[k]=0});
 const hasF=S.f&&Object.keys(S.f).length>0,JOIN=[', ','. ',' and ',' plus ',' no lie ',', and ','. also '],fam=FAMILY(S.topic),CAP=sad?99:Math.max(3,Math.ceil(n/40)),GMAX=sad?2:1,dead=new Set();let tries=0;
 while(out.length<n&&tries++<n*400){let open=tones.filter(k=>got[k]<want[k]&&!dead.has(k));if(!open.length)open=tones.filter(k=>!dead.has(k)&&k!=='E');if(!open.length)break;
  const tone=pick(open);
  if(tone==='E'){const e=emo(S),h=hash(sk+'|'+e);if(seen.has(e)||used.has(h)){if(++miss.E>400)dead.add('E');continue}seen.add(e);used.add(h);got.E++;out.push({t:e,tone:'E'});continue}
  let tpl,src='';const ex=extra[tone]||[],al=sad?[]:(ai[tone]||[]);
  if(al.length&&R(.3)){tpl=pick(al);src='ai'}else if(!sad&&ex.length&&R(.12)){tpl=pick(ex);src='own'}
  else if(hasF&&FACT[sad?'sad':tone]&&R(.14)){tpl=pick(FACT[sad?'sad':tone]);src='fact'}else tpl=wpick(pool(S.topic,tone));
  const bad=()=>{if(++miss[tone]>2500)dead.add(tone)};
  if(!tpl){bad();continue}const proper=tpl[0]==='^';
  let core=src==='ai'?tpl:fill(tpl,S);if(!core){bad();continue}if(src==='fact')src='';
  /* some people write more: two thoughts in one comment */
  if(!src&&!proper&&['L','H','S','F'].includes(tone)&&hasWord(core)&&core.length<60&&core.split(' ').length>2&&!/[?]/.test(core)&&R(.38)){const t2=wpick(pool(S.topic,tone));if(t2&&t2!==tpl&&t2[0]!=='^'){const c2=fill(t2,S);if(c2&&hasWord(c2)&&c2.length<60&&c2.split(' ').length>2&&!/[?]/.test(c2))core+=(sad?pick([', ','. ']):pick(JOIN))+c2}}
  const tails=(TAIL[fam][tone]||[]);let tail=0;if(!src&&!sad&&!proper&&tails.length&&core.length<34&&hasWord(core)&&!/[?,:]/.test(core)&&R(.12)){core+=', '+pick(tails);tail=1}
  const key=norm(core.replace(/\b(is|was|are|be|been|the|a|i|i'm|im|it's|its|really|just)\b/gi,''))||core;if(seen.has(key)){bad();continue}const h=hash(sk+'|'+key);if(used.has(h)){bad();continue}
  const G2=hasWord(core)?grams(core,S):{g:[core],words:[]};
  if(G2.g.some(x=>(GR.get(x)||0)>=GMAX)||G2.words.some(x=>(WC.get(x)||0)>=CAP)){bad();continue}
  G2.g.forEach(x=>GR.set(x,(GR.get(x)||0)+1));new Set(G2.words).forEach(x=>WC.set(x,(WC.get(x)||0)+1));
  seen.add(key);used.add(h);got[tone]++;miss[tone]=0;out.push({t:style(core,tone,S,tail,fx,proper),tone,src})}
 saveUsed();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
/* ---- what kind of story is it ---- */
const KIND=[['rip',/\b(rip|r\.i\.p|dies|died|dead at|passed away|passes away|death of|killed|fatal|funeral|tribute to|mourns?|remembering|found dead|overdose)\b/i],
 ['hurt',/\b(shot|shooting|hospitalized|hospital|injured|crash|accident|stabbed|robbed|critical condition|wounded)\b/i],
 ['legal',/\b(court|arrest(ed)?|charged|charges|lawsuit|sued|sues|trial|sentenced|jail|prison|indicted|rico|guilty|verdict|police|feds|warrant|bail|bond|robbery|raid|custody)\b/i],
 ['beef',/\b(beef|diss(es|ed)?|feud|clap ?s? ?back|responds? to|fires? back|shots at|calls? out|goes at|vs\.?)\b/i],
 ['game',/\b(video ?games?|gaming|gamers?|gta|grand theft auto|call of duty|cod|2k\d*|madden|fortnite|playstation|ps5|ps6|xbox|nintendo|switch 2|dlc|gameplay|esports|twitch|rockstar games|battle pass)\b/i],['history',/\b(anniversary|years ago|on this day|throwback|hip.?hop history|this day in|turns \d+|back in (19|20)\d\d)\b/i],
 ['tour',/\b(tour|concert|festival|tickets|live show|residency)\b/i],
 ['album',/\b(album|tracklist|deluxe|mixtape|ep)\b/i],['video',/\b(music video|visual|official video)\b/i],
 ['rap',/\b(drops?|dropped|releases?|new (single|song|music|track)|out now|snippet|remix|freestyle)\b/i],
 ['gossip',/\b(dating|boyfriend|girlfriend|married|marries|wedding|engaged|divorce|split|breakup|broke up|cheat(ing|ed|s)?|pregnan(t|cy)|baby (mama|daddy|bump)|expecting|spotted with|new boo|relationship|rumors?|claps back at fans)\b/i],
 ['beats',/\b(type beat|instrumentals?|beat ?tape|producer|beats?)\b/i],['indie',/\b(indie|independent|unsigned|underground artist|spotlight|next up)\b/i],
 ['funnyvid',/\b(funny|hilarious|lol|meme|comedy|skit|jokes?|roast(ed|s)?|laugh)\b/i],
 ['wild',/\b(wild|crazy|fight|brawl|goes off|chaos|caught on (camera|video)|viral|shocking|insane|wtf|chase|melee)\b/i]];
const kindOf=t=>{const k=KIND.find(([,r])=>r.test(t||''));return k?k[0]:'general'};
const VERB=/\b(delayed|cancell?ed|leaks?|leaked|trailer|update|review|drops?|dropped|releases?|released|arrested|charged|dies|dead|died|passes|passed|responds?|announces?|says?|said|shot|sued|sues|reacts?|claps?|signs?|signed|shares?|reveals?|speaks?|goes|gets?|got|is|was|has|calls?|fires?|addresses|denies|confirms?|buys?|wins?|loses?|joins?|teases?|unveils?|breaks?|slams?|returns?|launches|performs?|sentenced|indicted|hospitalized|robbed|found|faces?|pleads?|explains?|admits?|debuts?|links?|brings?|takes?|makes?|gives?|talks?|opens|just|allegedly|reportedly|officially|finally)\b/i;
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
const NAMES={L:'GOOD',H:'BAD',S:'CONTROVERSIAL',F:'FUNNY',T:'TO SOMEBODY',E:'EMOJIS ONLY',N:'OTHER'},MK=['L','H','S','F','T','E','N'];
const KINDS={drop:[['rap','RAP / HIP-HOP'],['rnb','R&B'],['album','ALBUM / TAPE'],['video','MUSIC VIDEO'],['beats','BEAT / INSTRUMENTAL']],
 news:[['general','NEWS'],['rap','NEW MUSIC'],['beef','BEEF'],['legal','CRIME + COURT'],['rip','TRAGIC: PASSED AWAY'],['hurt','TRAGIC: SOMEONE HURT'],['wild','WILD VIDEO'],['funnyvid','FUNNY VIDEO'],['tour','TOUR + SHOWS'],['gossip','CELEB + RELATIONSHIPS'],['local','LOCAL NEWS'],['shock','SHOCKING NEWS'],['game','VIDEO GAMES'],['beats','BEATS + INSTRUMENTALS'],['history','HIP-HOP HISTORY'],['indie','INDIE ARTIST']]};
function init(){const box=document.getElementById('t-comments');if(!box||box.dataset.on)return;box.dataset.on=1;
 const LS=(k,v)=>{try{if(v===undefined)return localStorage.getItem(k)||'';localStorage.setItem(k,v)}catch(e){return ''}};
 let st0={};try{st0=JSON.parse(LS('cmt_state')||'{}')}catch(e){}
 const V={from:st0.from||'drop',topic:st0.topic||'rap',pro:st0.pro||'',n:st0.n||300,kindSet:false},LIST=[];let filt='';
 box.innerHTML=`<p class="sub">Comments for what you made in THE DROP or NEWS. It reads the subject, then writes a fresh batch every time: good ones, bad ones, controversial ones, jokes, ones said to somebody and emoji-only ones. Some people type proper, most type slang. No phrase is used twice in a batch, and no comment is ever made twice for the same subject.</p>
 <div class="ctl"><div class="cur">THE SUBJECT <span>(filled in from what you made, change anything)</span></div>
 <div class="seg"><button data-cf="drop">FROM THE DROP</button><button data-cf="news">FROM THE NEWS</button></div>
 <span id="cm-drop"><input id="cma" class="tx" placeholder="Artist name"><input id="cms" class="tx" placeholder="Song name"></span>
 <span id="cm-news" style="display:contents"><input id="cmt" class="tx" placeholder="Headline" style="min-width:300px"><input id="cmw" class="tx" placeholder="Who it is about (name)"></span>
 <div class="cm-row"><b>WHAT KIND</b><span id="cm-kinds"></span></div>
 <div class="cm-row"><b>THEY ARE</b><div class="seg"><button data-cp="">NOT SURE</button><button data-cp="him">HIM</button><button data-cp="her">HER</button><button data-cp="they">A GROUP</button></div><small>so the comments say he, she or they the right way</small></div></div>
 <div class="ctl"><div class="cur">THE METER <span>(how the comments lean)</span></div>
 ${[['L','👍 GOOD',42],['H','👎 BAD',14],['S','🌶 CONTROVERSIAL',12],['F','😂 FUNNY',10],['T','💬 TO SOMEBODY',8],['E','🔥 EMOJIS ONLY',8],['N','❓ QUESTIONS + OTHER',6]].map(([k,n,d])=>`<div class="sl"><span>${n} <b data-pc="${k}"></b></span><input type="range" data-m="${k}" min="0" max="100" value="${st0['m'+k]==null?d:st0['m'+k]}"></div>`).join('')}
 <small id="cm-sad" hidden>Tragic news: every comment is respectful. No jokes, no hate, whatever the meter says.</small>
 <div class="cm-row"><b>HOW MANY</b><div class="seg"><button data-cn="50">50</button><button data-cn="100">100</button><button data-cn="300">300</button></div></div>
 <button id="cm-go" class="go">MAKE THE COMMENTS</button><button id="cm-all" class="go gr2">COPY ALL</button><button id="cm-ai" class="go gr2"${window.RM_CMT_AI?'':' hidden'}>🤖 ADD THE SMALL AI</button>
 <small id="cm-st">Nothing leaves this computer.</small></div>
 <div class="ctl" id="cm-bar" hidden><div class="seg" id="cm-f"></div><small>Click a comment to copy it. Copied ones go dim so you know which you used.</small></div>
 <div id="cm-list"></div>
 <details class="cm-own"><summary>ADD YOUR OWN LINES AND SLANG</summary><small>One per line. Start a line with <b>+</b> for a good one, <b>-</b> for a bad one, <b>!</b> for a controversial one, <b>?</b> for a question, <b>@</b> for one said to somebody, nothing for a joke. Write NAME where the artist goes and SONG where the song goes. Saved on this computer and mixed into every batch.</small>
 <textarea id="cm-own" placeholder="+ NAME got the streets on lock\n- this aint the one twin\n! SONG is carried by the beat"></textarea><button id="cm-mem" class="rs">FORGET PAST COMMENTS</button></details>`;
 const $=s=>box.querySelector(s),$$=s=>box.querySelectorAll(s),msg=h=>$('#cm-st').innerHTML=h,toast=t=>{if(typeof say==='function')say(t);else msg(esc(t))};
 const save=()=>{const o={from:V.from,topic:V.topic,pro:V.pro,n:V.n};$$('[data-m]').forEach(i=>o['m'+i.dataset.m]=+i.value);LS('cmt_state',JSON.stringify(o))};
 const mix=()=>{const o={};MK.forEach(k=>o[k]=+$(`[data-m="${k}"]`).value);return o};
 const drawKinds=()=>{$('#cm-kinds').innerHTML='<div class="seg">'+KINDS[V.from].map(([k,n])=>`<button data-ck="${k}" class="${k===V.topic?'on':''}">${n}</button>`).join('')+'</div>'};
 const draw=()=>{$$('[data-cf]').forEach(b=>b.classList.toggle('on',b.dataset.cf===V.from));$('#cm-drop').style.display=V.from==='drop'?'contents':'none';$('#cm-news').style.display=V.from==='news'?'contents':'none';
  if(!KINDS[V.from].some(([k])=>k===V.topic))V.topic=KINDS[V.from][0][0];drawKinds();
  $$('[data-cp]').forEach(b=>b.classList.toggle('on',b.dataset.cp===V.pro));$$('[data-cn]').forEach(b=>b.classList.toggle('on',+b.dataset.cn===V.n));
  const m=mix(),t=MK.reduce((a,k)=>a+m[k],0)||1;MK.forEach(k=>$(`[data-pc="${k}"]`).textContent=Math.round(m[k]/t*100)+'%');
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
  const N=names($('#cmw').value);return {topic:V.topic,a:N[0]||'',a2:N[1]||'',s:'',pro:V.pro,k:$('#cmt').value.trim(),f:facts($('#cmt').value+' '+val('ncap'))}};
 const show=()=>{const L=LIST.filter(x=>!filt||x.tone===filt);$('#cm-bar').hidden=!LIST.length;
  const c={};LIST.forEach(x=>c[x.tone]=(c[x.tone]||0)+1);$('#cm-f').innerHTML=`<button data-f="" class="${filt?'':'on'}">ALL ${LIST.length}</button>`+MK.filter(k=>c[k]).map(k=>`<button data-f="${k}" class="${filt===k?'on':''}">${SAD(V.topic)&&k==='L'?'RESPECT':NAMES[k]} ${c[k]}</button>`).join('');
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
  msg(L.length<V.n?`<b class="cm-w">Made ${L.length}. That is every comment left for this subject without repeating a phrase: move the meter or add your own lines for more.</b>`:`Made ${L.length} new comments in ${Math.max(1,Math.round(performance.now()-t0))} ms. Press it again for a whole new batch.`+(S.f&&Object.keys(S.f).length?' Picked up from the story: '+esc(Object.entries(S.f).map(([k,v])=>k==='again'?'it happened again':k==='yrs'?v+' years':k==='age'?'age '+v:v).join(', '))+'.':''));
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
window.CMT={make,kindOf,whoOf,T,init,fill,facts,pool,wpick};
const css=document.createElement('style');css.textContent=`#t-comments .cm-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;width:100%;margin-top:4px}#t-comments .cm-row>b{font:800 11px Inter,sans-serif;letter-spacing:.14em;color:#bbb;min-width:90px}
#t-comments [hidden]{display:none!important}#t-comments .seg{flex-wrap:wrap}#t-comments .sl b{color:#e11d2a;margin-left:4px}
#cm-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:6px;margin:14px 0 30px}
.cm-c{display:flex;align-items:center;gap:10px;text-align:left;background:#141414;border:1px solid #2a2a2a;color:#fff;padding:10px 12px;font:15px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;cursor:pointer;min-height:44px}
.cm-c:hover{border-color:#e11d2a}.cm-c span{flex:1;overflow-wrap:anywhere}.cm-c i{width:8px;height:8px;border-radius:50%;flex:none;background:#888}.cm-c.tL i{background:#2ecc71}.cm-c.tH i{background:#e11d2a}.cm-c.tS i{background:#f39c12}.cm-c.tF i{background:#4aa3ff}.cm-c.tT i{background:#b06cff}.cm-c.tE i{background:#ff7a1a}
.cm-c u{text-decoration:none;font:800 10px Inter,sans-serif;letter-spacing:.12em;color:#888;flex:none}.cm-c em{font:800 9px Inter,sans-serif;letter-spacing:.1em;color:#111;background:#f39c12;padding:2px 5px;font-style:normal;flex:none}
.cm-c.done{opacity:.35}.cm-w{color:#e8a33a}
.cm-own{margin:0 0 40px;color:#bbb;font:13px Inter,sans-serif}.cm-own summary{cursor:pointer;font:800 12px Inter,sans-serif;letter-spacing:.14em;color:#fff;padding:10px 0}.cm-own textarea{display:block;width:100%;min-height:120px;margin:10px 0;background:#0b0b0b;border:1px solid #333;color:#fff;padding:10px;font:14px system-ui,sans-serif;box-sizing:border-box}`;
document.head.appendChild(css);
if(document.readyState==='loading')addEventListener('DOMContentLoaded',init);else init();
})();
