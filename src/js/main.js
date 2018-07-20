// import './jquery-3.3.1.slim.min.js';
// import './popper.min.js';

import 'jquery';
import 'popper.js';
import 'bootstrap';
//var jquery = require('jquery');
//var popper = require('popper');
//var bootstrap = require('bootstrap');

//require ('../css/style.css');

import "../scss/style.scss";


var gitCmd = document.getElementById("gitcmd");
var recastAPIurl = 'https://api.recast.ai/v2/request?text=';
var githubCreateRepoAPIurl = 'https://api.github.com/user/repos';
var githubCreateIssueAPIurl = 'https://api.github.com/repos/anokha777/';
var fetchAllIssues = 'https://api.github.com/repos/anokha777/';
var addColleboratorUrl = 'https://api.github.com/repos/anokha777/';
var submitIssueCommentUrl = 'https://api.github.com/repos/anokha777/';
var repoName = '';

function  showLoader(){
    document.getElementById('mainBody').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
}

function  hideLoader(){
    document.getElementById('mainBody').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
}

gitCmd.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        callRecastAI(e);
    }
});


window.onload = function showNone ()  {
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("createGithubRepo").style.display = 'none';
    document.getElementById("createGithubIssue").style.display = 'none';
    document.getElementById("displayAllIssues").style.display = 'none';
    document.getElementById("loader").style.display = "none";
    document.getElementById("mainBody").style.display = "block";
    document.getElementById('gitcmd').focus();
}

// Calling Recast AI to get intent of user
function callRecastAI(e) {

    var text = e.target.value;
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';
    document.getElementById("createGithubRepo").style.display = 'none';
    document.getElementById("createGithubIssue").style.display = 'none';
    document.getElementById("displayAllIssues").style.display = 'none';

    showLoader();
    

    fetch(recastAPIurl + text, {
        method: "post",
        headers: {
            'Authorization': 'Token b12d153ce771f6e115faad00694f983b',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        response.json().then(response => {
            // If responce from recast.ai is to create new github repository.
            if (response.results.intents[0].slug == 'create-git-repo') {
                repoName = response.results.entities.git_repo[0].value;
                console.log(repoName);
                document.getElementById("createGithubRepo").style.display = 'block';
                document.getElementById("repositoryName").value = repoName;
                document.getElementById("commandComment").focus();
                hideLoader();
            }// If responce from recast.ai is to create new github issue.
            else if (response.results.intents[0].slug == 'create-git-issue') {
                document.getElementById("createGithubIssue").style.display = 'block';
                document.getElementById("issueRepoName").value = response.results.entities.git_repo[0].value;
                document.getElementById("issueName").value = response.results.entities.git_issue[0].value;
                document.getElementById("issueCommandComment").focus();
                hideLoader();
            }// If responce from recast.ai is to fetch all issues for a repository.
            else if (response.results.intents[0].slug == 'fetch-all-git-issue') {
                displayAllIssues(response.results);
            }// If responce from recast.ai is to add git coleborator for a repository.
            else if (response.results.intents[0].slug == 'add-git-coleborator') {
                addGitCollaborator(response.results.entities.git_repo[0].value, response.results.entities.git_collaborator[0].value);
            }
        }).catch(function () {
            console.log("There is error in resolving name of repository from sentence...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'There is error in resolving name of repository from sentence...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in recast.ai api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in recast.ai api call...';
        hideLoader();
    });

}

//Function to create repository
//function createRepositoryOnGithub(repositoryName, commandComment) {
window.createRepositoryOnGithub = function (repositoryName, commandComment){
    showLoader();
    fetch('https://api.github.com/user/repos', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        },
        body: JSON.stringify({
            "name": repositoryName,
            "description": commandComment
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Repository with name ';
            successMsg += response.name + " created and has permission of admin " + response.permissions.admin + " for creater.";
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
            console.log(response.name);
            document.getElementById("repositoryName").value = response.name;
            hideLoader();
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        hideLoader();
    });
    
}

//Function to create issue
//function createIssueOnGithub(issueRepoName, issueName, issueCommandComment) {
window.createIssueOnGithub = function (issueRepoName, issueName, issueCommandComment){
    showLoader();
    fetch('https://api.github.com/repos/anokha777/' + issueRepoName + '/issues', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        },
        body: JSON.stringify({
            "title": issueName,
            "body": issueCommandComment,
            "assignees": ["anokha777"],
            "labels": ["bug"]
        })
    }).then((response) => {
        response.json().then(response => {
            if(response.message !='Not Found'){
                var successMsg = 'Issue created with issue number - ' + response.number + " and its current status is " + response.state;
                document.getElementById("success_msg").style.display = 'block';
                document.getElementById("success_msg").innerHTML = successMsg;
            }else{
                var successMsg = 'There are no such reposiroty with name - ' + issueRepoName + ' in your git account. Please try with valid repository name.';
                document.getElementById("fail_msg").style.display = 'block';
                document.getElementById("fail_msg").innerHTML = successMsg;               
            }

            document.getElementById("issueRepoName").value = issueRepoName;
            document.getElementById("issueName").value = issueName;
            document.getElementById("issueCommandComment").value = issueCommandComment;
            
            hideLoader();
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        hideLoader();
    });
    
}

//Function to list down all issues for a repository
function displayAllIssues(recastAIresponse) {
    //call github api to fetch all issue for a repository.
    fetch('https://api.github.com/repos/anokha777/' +  recastAIresponse.entities.git_repo[0].value +'/issues?state=all', { 
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        }
    }).then((response) => {
        response.json().then((response) => {
            var successMsg = "Please find below total " + response.length + " issue from github repository - " + recastAIresponse.entities.git_repo[0].value
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
            document.getElementById("repo_name").value = recastAIresponse.entities.git_repo[0].value;

            //to remove old issue list value from DOM                
            var oldDOMIssuesList = document.getElementById('tableBody');
            while(oldDOMIssuesList.firstChild){
                oldDOMIssuesList.removeChild(oldDOMIssuesList.firstChild);
            }

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
            hideLoader();

        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        hideLoader();
    });
}

// Function to add github collaborator
function addGitCollaborator(gitRepoName, gitCollaboratorUser){
    fetch('https://api.github.com/repos/anokha777/' + gitRepoName +  '/collaborators/' + gitCollaboratorUser + '?permission=admin', {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        }}).then((response) => {
        response.json().then((res) => {

            if(res.message == 'Not Found'){
                console.log("Github responded successfully but there is problem in parsing response...");
                document.getElementById("fail_msg").style.display = 'block';
                document.getElementById("fail_msg").innerHTML = 'Either Github user name - '+gitCollaboratorUser + ' or Repository name - '+gitRepoName + ' is not available. Please check either of these.';
            }else{
                var successMsg = 'We have successfully sent a request to '+gitCollaboratorUser+' for collaborator role - '+'admin'+' in your repository - ' + gitRepoName;
                document.getElementById("success_msg").style.display = 'block';
                document.getElementById("success_msg").innerHTML = successMsg;
            }
            hideLoader();

        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'There is no such user called - '+gitCollaboratorUser;
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is no such user called - '+gitCollaboratorUser;
        hideLoader();
    });
}

//Function to add comment for an issue.
//function submitIssueComment(cmtOnIssue){
window.submitIssueComment = function (cmtOnIssue){
    showLoader();
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';

    fetch('https://api.github.com/repos/anokha777/' + repoName + '/issues/' +issueNumber+ '/comments', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        },
        body: JSON.stringify({
            "body": cmtOnIssue
        })
    }).then((response) => {
        response.json().then(response => {
            var successMsg = 'Your comment is updated successfully';
            document.getElementById("success_msg").style.display = 'block';
            document.getElementById("success_msg").innerHTML = successMsg;
            hideLoader();
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        hideLoader();
    });
    
}

//Function to show last comment for an issue.
window.showLastComment = function (){
    showLoader();
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';
console.log('Function to show last comment for an issue------ '+repoName +' - '+issueNumber);
    fetch('https://api.github.com/repos/anokha777/' + repoName + '/issues/' +issueNumber+ '/comments', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        }}).then((response) => {
        response.json().then(response => {
            if(response.length > 0){
                // document.getElementById("lastIssueComment").style.display = 'none';
                // document.getElementById("lastIssueComment").style.display = '';
                // document.getElementById("lastIssueHeader").innerHTML = '';
                document.getElementById("lastIssueComment").style.display = 'block';
                // document.getElementById("lastIssueHeader").innerHTML ='';
                document.getElementById("lastIssueHeader").innerHTML = 'Below is the last comment for issue at: '+response[response.length -1].created_at;
                //to remove old comment value from DOM                
                var div1 = document.getElementById('actualIssueCmt');
                while(div1.firstChild){
                    div1.removeChild(div1.firstChild);
                }

                var commentTag = document.createElement('a');
                commentTag.setAttribute('href',response[response.length -1].html_url);
                commentTag.setAttribute('target',"_blank");
                commentTag.innerHTML = response[response.length -1].body;
                document.getElementById("actualIssueCmt").appendChild(commentTag); 
                  
                //commentTag = null;
            }else{
                document.getElementById("lastIssueComment").style.display = 'none';
                document.getElementById("fail_msg").style.display = 'none';
                document.getElementById("success_msg").style.display = 'block';
                document.getElementById("success_msg").innerHTML = 'As of now, There is no comment for issue number - '+issueNumber;
            }
            hideLoader();
        }).catch(function () {
            console.log("There is problem while fetching issue comment...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        hideLoader();
    });
    
}

//Function to close issue
window.closeIssue = function (){
    showLoader();
    var repoName = document.getElementById("repo_name").value;
    var issueNumber = document.querySelector('input[name="issue"]:checked').value;
    document.getElementById("lastIssueComment").style.display = 'none';
    document.getElementById("success_msg").style.display = 'none';
    document.getElementById("fail_msg").style.display = 'none';

    fetch('https://api.github.com/repos/anokha777/' + repoName + '/issues/' +issueNumber, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
        }}).then((response) => {
        response.json().then(response => {
            console.log('While closing an issue - '+response.state);
            if(response.state === 'closed'){
                var successMsg = 'Issue number - (' + response.number + '. ' + response.title +') is alredy closed.';
                document.getElementById("success_msg").style.display = 'block';
                document.getElementById("success_msg").innerHTML = successMsg;
                document.getElementById("success_msg").focus();
                hideLoader();
            }else{
                fetch('https://api.github.com/repos/anokha777/' + repoName + '/issues/' +issueNumber, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token 8bcba7d316a9b1a2a7090d689b4aec41bf32153f'
                    },
                    body: JSON.stringify({
                        "state": "closed",
                        "labels": ["closed"]
                    })
                }).then((response) => {
                    response.json().then(response => {
                        var successMsg = 'Issue number - ' + response.number + " closed successfully, its current status is " + response.state;
                        document.getElementById("success_msg").style.display = 'block';
                        document.getElementById("success_msg").innerHTML = successMsg;
                        document.getElementById("success_msg").focus();
                        hideLoader();
                    }).catch(function () {
                        console.log("Github responded successfully but there is problem in parsing response...");
                        document.getElementById("fail_msg").style.display = 'block';
                        document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
                        document.getElementById("fail_msg").focus();
                        hideLoader();
                    });
                    hideLoader();
                }).catch(function () {
                    console.log("There is error in github api call...");
                    document.getElementById("fail_msg").style.display = 'block';
                    document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
                    document.getElementById("fail_msg").focus();
                    hideLoader();
                });
            }
        }).catch(function () {
            console.log("Github responded successfully but there is problem in parsing response after getting status of issue...");
            document.getElementById("fail_msg").style.display = 'block';
            document.getElementById("fail_msg").innerHTML = 'Github responded successfully but there is problem in parsing response...';
            document.getElementById("fail_msg").focus();
            hideLoader();
        });
    }).catch(function () {
        console.log("There is error in github api call for getting status of issue...");
        document.getElementById("fail_msg").style.display = 'block';
        document.getElementById("fail_msg").innerHTML = 'There is error in github api call...';
        document.getElementById("fail_msg").focus();
        hideLoader();
    });

    
}

