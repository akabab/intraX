# The procedure connects the visitor.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'login=adjivas&password=w2rekt' \
#	http://127.0.0.1:3000/auths/signin;

#
# Simple exemple of adds of first category.
# http://127.0.0.1:3000/forum/category/add with name

## The procedure adds the catogory adm.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=adm' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory associations.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=associations' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory general.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=general' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory ns.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=ns' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory algo.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=algo-1-001' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory embq.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=embq-1-001' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory igraph.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=igraph-1-001' \
#	http://127.0.0.1:3000/forum/category/add;
#
## The procedure adds the catogory piscine.
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=piscine' \
#	http://127.0.0.1:3000/forum/category/add;

#
# Simple exemple of adds of second category.
# http://127.0.0.1:3000/forum/category/add with name and node

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=boiteaidee&node=539f1dc4b4e842bfa36a5ded' \
#	http://127.0.0.1:3000/forum/category/add;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objetsperdus&node=539f1dc4b4e842bfa36a5ded' \
#	http://127.0.0.1:3000/forum/category/add;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objetstrouves&node=539f1dc4b4e842bfa36a5ded' \
#	http://127.0.0.1:3000/forum/category/add;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=petitesannonces&node=539f1dc4b4e842bfa36a5ded' \
#	http://127.0.0.1:3000/forum/category/add;
#

#
# Simple exemple of sets of a category.
# http://127.0.0.1:3000/forum/category/set with name and node

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=boite%20a%20idee&node=539ef7ff6076da768667e200' \
#	http://127.0.0.1:3000/forum/category/set;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objets%20perdus&node=539ef7ff6076da768667e201' \
#	http://127.0.0.1:3000/forum/category/set;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objets%20trouves&node=539ef7ff6076da768667e202' \
#	http://127.0.0.1:3000/forum/category/set;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=petites%20annonces&node=539ef7ff6076da768667e203' \
#	http://127.0.0.1:3000/forum/category/set;

#
# Simple exemple of dels of a category.
# http://127.0.0.1:3000/forum/category/set with name and node

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=boite%20a%20idee&node=539efac66076da768667e204' \
#	http://127.0.0.1:3000/forum/category/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objets%20perdus&node=539efac66076da768667e205' \
#	http://127.0.0.1:3000/forum/category/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=objets%20trouves&node=539efac66076da768667e206' \
#	http://127.0.0.1:3000/forum/category/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'name=petites%20annonces&node=539efac66076da768667e207' \
#	http://127.0.0.1:3000/forum/category/del;

#
# Simple exemple of adds/opens of a category for one account.
# http://127.0.0.1:3000/forum/accounts/add with categoryIsOpen and idAccount.

#curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'categoryIsOpen=539f1f001b250727a4493bbd&idAccount=539f1781a592e3309e9f34ce' \
#	http://127.0.0.1:3000/forum/accounts/add;

#
# Simple exemple of adds/opens of a category for one account.
# http://127.0.0.1:3000/forum/accounts/del with categoryIsOpen and idAccount.

#curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'categoryIsOpen=539f1f001b250727a4493bbd&idAccount=539f1781a592e3309e9f34ce' \
#	http://127.0.0.1:3000/forum/accounts/del;

#
# Simple exemple of adds of a new topic and a new message from this topic.
# http://127.0.0.1:3000/forum/topic/new with idCategory, description and contenue.

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5dee&description=topic-ns-1&contenue=message-ns-2' \
#	http://127.0.0.1:3000/forum/topic/new;

#curl -i \
#-H "Content-Type:application/x-www-form-urlencoded" \
#-X POST --data 'idCategory=539f1dc4b4e842bfa36a5dec&description=42%20du%2095&contenue=messageLOL1' \
#http://127.0.0.1:3000/forum/topic/new;

#
# Simple exemple of dels of a topic.
# http://127.0.0.1:3000/forum/topic/del with idTopic, idCategory and idTopic.

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5dec&idTopic=53a2f557d2889000005cf7d8' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a2006a803e860000a6d6da' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a2007e8b11660000a13cdb' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a200b52fcc9100004b7710' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a200bfa74f0d000047c2bd' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a200f3cbf0bf0000a47039' \
#	http://127.0.0.1:3000/forum/topic/del;
#
#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idCategory=539f1dc4b4e842bfa36a5ded&idTopic=53a2010892d40f0000a494cc' \
#	http://127.0.0.1:3000/forum/topic/del;

#
# Simple exemple of adds of a new message from topic.
# http://127.0.0.1:3000/forum/message/add with idTopic, idMessageParent and contenue.

#	curl -i \
#	-H "Content-Type:application/x-www-form-urlencoded" \
#	-X POST --data 'idTopic=53a30a9c4d0d8d00009aeaf4&contenue=message2&idMessageParent' \
#	http://127.0.0.1:3000/forum/message/add;

#
# Simple exemple of adds of a new message from topic.
# http://127.0.0.1:3000/forum/message/add with idTopic, idMessageParent and contenue.

#	curl -is 127.0.0.1:3000/forum/message/associations/kevin-du-95

# Simple exemple of sees of a topic's group.

#curl -is http://127.0.0.1:3000/forum/topic/ns
