var gitCmd = document.getElementById("gitcmd");
var recastAPIurl = 'https://api.recast.ai/v2/request?text=';
var githubCreateRepoAPIurl = 'https://api.github.com/user/repos';
var githubCreateIssueAPIurl = 'https://api.github.com/repos/anokha777/';
var fetchAllIssues = 'https://api.github.com/repos/anokha777/';
var addColleboratorUrl = 'https://api.github.com/repos/anokha777/';
var submitIssueCommentUrl = 'https://api.github.com/repos/anokha777/';
var repoName = '';


function showNone() {
    document.getElementById('gitcmd').focus();
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("createGithubRepo").style.display = 'none';
    document.getElementById("createGithubIssue").style.display = 'none';
    document.getElementById("displayAllIssues").style.display = 'none';
    
    

}

gitCmd.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        callRecastAI(e);
    }
});

// Calling Recast AI to get intent of user
function callRecastAI(e) {
    var text = e.target.value;
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';
    document.getElementById("createGithubRepo").style.display = 'none';
    document.getElementById("createGithubIssue").style.display = 'none';
    document.getElementById("displayAllIssues").style.display = 'none';

    fetch(recastAPIurl + text, {
        method: "post",
        headers: {
            'Authorization': 'Token b12d153ce771f6e115faad00694f983b',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        response.json().then(response => {
            // document.getElementById("success_msg").style.display = 'none';
            // document.getElementById("createGithubRepo").style.display = 'none';
            // document.getElementById("createGithubIssue").style.display = 'none';
            

            // If responce from recast.ai is to create new github repository.
            if (response.results.intents[0].slug == 'create-git-repo') {
                repoName = response.results.entities.git_repo[0].value;
                console.log(repoName);
                document.getElementById("createGithubRepo").style.display = 'block';
                document.getElementById("repositoryName").value = repoName;
                document.getElementById("commandComment").focus();
            }// If responce from recast.ai is to create new github issue.
            else if (response.results.intents[0].slug == 'create-git-issue') {
                // repoName = response.results.entities.git_repo[0].value;
                // console.log(repoName);
                document.getElementById("createGithubIssue").style.display = 'block';
                document.getElementById("issueRepoName").value = response.results.entities.git_repo[0].value;
                document.getElementById("issueName").value = response.results.entities.git_issue[0].value;
                document.getElementById("issueCommandComment").focus();
            }// If responce from recast.ai is to fetch all issues for a repository.
            else if (response.results.intents[0].slug == 'fetch-all-git-issue') {
                displayAllIssues(response.results);
            }// If responce from recast.ai is to add git coleborator for a repository.
            else if (response.results.intents[0].slug == 'add-git-coleborator') {
                addGitCollaborator(response.results.entities.git_repo[0].value, response.results.entities.git_collaborator[0].value);
            }

            



        }).catch(function () {
            console.log("There is some error in resolving name of repository from sentence...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'There is some error in resolving name of repository from sentence...';
        });
    }).catch(function () {
        console.log("There is some error in recast.ai api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in recast.ai api call...';
    });

}

//Function to create repository
function createRepositoryOnGithub(repositoryName, commandComment) {
    fetch(githubCreateRepoAPIurl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        },
        body: JSON.stringify({
            "name": repositoryName,
            "description": commandComment
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Repository with name ';
            successMsg += repoName + " created and has permission of admin " + response.permissions.admin + " for creater.";
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
            console.log(repoName);
            //document.getElementById("repository-name").value = repoName;
            document.getElementById("repositoryName").value = repoName;
        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

//Function to create issue
function createIssueOnGithub(issueRepoName, issueName, issueCommandComment) {
    fetch(githubCreateIssueAPIurl + issueRepoName + '/issues', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        },
        body: JSON.stringify({
            "title": issueName,
            "body": issueCommandComment,
            "assignees": ["anokha777"],
            "labels": ["bug"]
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Issue created with issue number - ' + response.number + " and its current status is " + response.state;
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;

            document.getElementById("issueRepoName").value = issueRepoName;
            document.getElementById("issueName").value = issueName;
            document.getElementById("issueCommandComment").value = issueCommandComment;

        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

//Function to list down all issues for a repository
function displayAllIssues(recastAIresponse) {
    //call github api to fetch all issue for a repository.

    fetch(fetchAllIssues + recastAIresponse.entities.git_repo[0].value + '/issues', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        }
    }).then((response) => {
        response.json().then((response) => {
            var successMsg = "Please find below total " + response.length + " issue from github repository - " + recastAIresponse.entities.git_repo[0].value
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
            document.getElementById("repo_name").value = recastAIresponse.entities.git_repo[0].value;
            //display all issues
            document.getElementById("displayAllIssues").style.display = 'block';
            var tableBody = document.getElementById('tableBody');
            //var table = document.createElement('table');
            for (var i = 0; i < response.length; i++){
                var tr = document.createElement('tr');   

                var td0 = document.createElement('td');
                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');
                var td5 = document.createElement('td');
                var td6 = document.createElement('td');
                var td7 = document.createElement('td');

                var repoTag = document.createElement('a');
                repoTag.setAttribute('href',response[i].user.html_url);
                repoTag.setAttribute('target',"_blank");
                repoTag.innerHTML = "Go Owner Home";

                var issueTag = document.createElement('a');
                issueTag.setAttribute('href',response[i].html_url);
                issueTag.setAttribute('target',"_blank");
                issueTag.innerHTML = "Open Issue";

                var radioBtn = document.createElement('input');
                radioBtn.type = "radio";
                radioBtn.name = "issue";
                radioBtn.value = response[i].number;

                var issueNo = document.createTextNode(response[i].number);
                var issueTitle = document.createTextNode(response[i].title);
                var issueStatus = document.createTextNode(response[i].state);
                var issueLabel = document.createTextNode(response[i].labels[0].name);
                var createTm = document.createTextNode(response[i].created_at);

                td0.appendChild(radioBtn);
                td1.appendChild(issueNo);
                td2.appendChild(issueTitle);
                td3.appendChild(issueStatus);
                td4.appendChild(issueLabel);
                td5.appendChild(repoTag);
                td6.appendChild(issueTag);
                td7.appendChild(createTm);
                tr.appendChild(td0);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
                tr.appendChild(td6);
                tr.appendChild(td7);
                tableBody.appendChild(tr);
            }
            //document.table.appendChild(tableBody);

        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

// Function to add github collaborator
function addGitCollaborator(gitRepoName, gitCollaboratorUser){
    fetch(addColleboratorUrl + gitRepoName +  '/collaborators/' + gitCollaboratorUser + '?permission=admin', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        }}).then((response) => {
        response.json().then(response => {
            var successMsg = 'We have successfully sent a request to '+gitCollaboratorUser+' for collaborator role - '+'admin'+' in your repository - ' + gitRepoName;
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

//Function to add comment for an issue.
function submitIssueComment(cmtOnIssue){
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;

    fetch(submitIssueCommentUrl + repoName + '/issues/' +issueNumber+ '/comments', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        },
        body: JSON.stringify({
            "body": cmtOnIssue
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Your comment is updated successfully';
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;

        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

//Function to show last comment for an issue.
function showLastComment(){
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;

    fetch(submitIssueCommentUrl + repoName + '/issues/' +issueNumber+ '/comments', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        }}).then((response) => {
        response.json().then(response => {
            //var successMsg = 'Your comment is updated successfully';
            //document.getElementById("success_msg").style.display = 'block';
            document.getElementById("lastIssueComment").style.display = 'block';
            document.getElementById("lastIssueHeader").innerHTML = 'Below is the last comment for issue at: '+response[response.length -1].created_at;
            
            var commentTag = document.createElement('a');
            commentTag.setAttribute('href',response[response.length -1].html_url);
            commentTag.setAttribute('target',"_blank");
            commentTag.innerHTML = response[response.length -1].body;
            document.getElementById("actualIssueCmt").appendChild(commentTag);     
            
        }).catch(function () {
            console.log("There is some problem while fetching issue comment...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });
}

//Function to close issue
function closeIssue(){
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;

    fetch(submitIssueCommentUrl + repoName + '/issues/' +issueNumber+ '/comments', {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 84170a354387ea1c5ad9e5d7793a218d1c547dbf'
        },
        body: JSON.stringify({
            "title": "Found a bug - closing this issue",
            "body": "I am closing this bug from api. - closing issue",
            "assignees": ["anokha777"],
            "state": "closed",
            "labels": ["closed"]
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Issue number - ' + response.number + " closed successfully, its current status is " + response.state;
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
        }).catch(function () {
            console.log("Github responded successfully but there is some problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is some problem in parsing response...';
        });
    }).catch(function () {
        console.log("There is some error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is some error in github api call...';
    });

}