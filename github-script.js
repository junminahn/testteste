const fs = require('fs');
const execShPromise = require('exec-sh').promise;
const yaml = require('js-yaml');

// This module runs in GitHub Action `github-script`
// see https://github.com/actions/github-script#run-a-separate-file-with-an-async-function
module.exports = async ({ github, context }) => {
  const { payload } = context;

  const issue_number = payload.issue.number;
  const owner = payload.repository.owner.login;
  const repo = payload.repository.name;

  // console.log('github', JSON.stringify(github, null, 2));
  // console.log('content', JSON.stringify(context, null, 2));

  const patt = new RegExp('```yml((.|\n|\r\n)*?)```', 'g');
  let content = payload.issue.body;
  console.log(content);

  m = patt.exec(content);

  if (m) {
    content = m[1];
  }

  const deleteComment = async (comment) => {
    if (
      comment.user.login === 'github-actions[bot]' &&
      comment.user.type === 'Bot'
    ) {
      await github.issues.deleteComment({
        owner,
        repo,
        comment_id: comment.id,
      });
    }
  };

  const getSHA = async (ref, path) => {
    const data = await github.repos
      .getContent({
        owner,
        repo,
        ref,
        path,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    return data.sha;
  };

  try {
    console.log(content);
    const doc = yaml.load(content);

    const comments = await github.issues
      .listComments({
        issue_number,
        owner,
        repo,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    await Promise.all(comments.map(deleteComment));

    await github.issues.createComment({
      issue_number,
      owner,
      repo,
      body: JSON.stringify(doc),
    });

    const mainRef = await github.git
      .getRef({
        owner,
        repo,
        ref: `heads/${payload.repository.default_branch}`,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    if (!mainRef) {
      console.error('no main branch');
    }

    const prBranchName = 'testbranch222222222222222';

    let prRef = await github.git
      .getRef({
        owner,
        repo,
        ref: `heads/${prBranchName}`,
      })
      .then(
        (res) => res.data,
        (err) => null
      );

    console.log(prRef);

    if (!prRef) {
      await github.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${prBranchName}`,
        sha: mainRef.object.sha,
      });
    }

    await github.repos.createOrUpdateFileContents({
      owner,
      repo,
      sha: getSHA({
        owner,
        repo,
        ref: prBranchName,
        path: 'testss/reverse.js',
      }),
      branch: prBranchName,
      path: 'testss/reverse.js',
      message: 'test new branch',
      content: fs.readFileSync('reverse.js', { encoding: 'base64' }),
    });

    const out = await execShPromise('pwd', true);
    console.log(out);

    // Create a PR to merge the licence ref into master
    await github.pulls.create({
      owner,
      repo,
      base: payload.repository.default_branch,
      head: prBranchName,
      title: 'test title',
      body: 'test body',
      maintainer_can_modify: true,
    });
  } catch (e) {
    console.log(e);
  }

  // const mainbr = await github.git.getRef({
  //   ...params,
  //   ref: `heads/${payload.repository.default_branch}`,
  // });

  // // Create a branch to commit to commit the license file
  // await github.git.createRef({
  //   ...params,
  //   ref: `refs/heads/${srcBranchName}`,
  //   sha: mainbr.data.object.sha, // where we fork from
  // });

  // If we don't have a main branch we won't have anywhere
  // to merge the PR.
  // const mainbr = await github.git.getRef({
  //   owner,
  //   repo,
  //   ref: `heads/${payload.repository.default_branch}`,
  // });

  // Create a branch to commit to commit the license file
  // await github.git.createRef({
  //   owner,
  //   repo,
  //   ref: `refs/heads/newbranch`,
  //   sha: mainbr.data.object.sha,
  // });

  // // const aParams = fileSHA !== '' ? { owner, repo, sha: fileSHA } : params;

  // // // Add the file to the new branch
  // await github.repos.createOrUpdateFile({
  //   owner,
  //   repo,
  //   branch: 'newbranch',
  //   content: fs.readFileSync('e2e-prep.js', { encoding: 'base64' }),
  //   message: 'test new branch',
  //   path: 'e2e-prep.js',
  // });

  // await github.repos.createOrUpdateFile({
  //   ...aParams,
  //   branch: srcBranchName,
  //   content: Buffer.from(fileData).toString('base64'),
  //   message: commitMessage,
  //   path: fileName,
  // });

  // // Create a PR to merge the licence ref into master
  // await github.pulls.create({
  //   ...params,
  //   base: payload.repository.default_branch,
  //   body: prBody,
  //   head: srcBranchName,
  //   maintainer_can_modify: true, // maintainers can edit this PR
  //   title: prTitle,
  // });

  // return context;
};

// {
//   "payload": {
//     "action": "edited",
//     "changes": {
//       "body": {
//         "from": "```yml\r\nrealmName: ospp2ffffgggff\r\nclientName: test-client\r\nenvironments:\r\n    - dev:\r\n        redirectUrls:\r\n            - https://example.com\r\n            - https://example.com2\r\n    - test:\r\n        redirectUrls:\r\n            - https://testexample.com\r\n            - https://testexample.com2\r\n```"
//       }
//     },
//     "issue": {
//       "active_lock_reason": null,
//       "assignee": null,
//       "assignees": [],
//       "author_association": "OWNER",
//       "body": "```yml\r\nrealmName: ospp2ffffgggffbbbb\r\nclientName: test-client\r\nenvironments:\r\n    - dev:\r\n        redirectUrls:\r\n            - https://example.com\r\n            - https://example.com2\r\n    - test:\r\n        redirectUrls:\r\n            - https://testexample.com\r\n            - https://testexample.com2\r\n```",
//       "closed_at": null,
//       "comments": 0,
//       "comments_url": "https://api.github.com/repos/junminahn/testteste/issues/2/comments",
//       "created_at": "2021-06-06T23:04:16Z",
//       "events_url": "https://api.github.com/repos/junminahn/testteste/issues/2/events",
//       "html_url": "https://github.com/junminahn/testteste/issues/2",
//       "id": 912971155,
//       "labels": [],
//       "labels_url": "https://api.github.com/repos/junminahn/testteste/issues/2/labels{/name}",
//       "locked": false,
//       "milestone": null,
//       "node_id": "MDU6SXNzdWU5MTI5NzExNTU=",
//       "number": 2,
//       "performed_via_github_app": null,
//       "repository_url": "https://api.github.com/repos/junminahn/testteste",
//       "state": "open",
//       "title": "issue title",
//       "updated_at": "2021-06-06T23:30:41Z",
//       "url": "https://api.github.com/repos/junminahn/testteste/issues/2",
//       "user": {
//         "avatar_url": "https://avatars.githubusercontent.com/u/36021827?v=4",
//         "events_url": "https://api.github.com/users/junminahn/events{/privacy}",
//         "followers_url": "https://api.github.com/users/junminahn/followers",
//         "following_url": "https://api.github.com/users/junminahn/following{/other_user}",
//         "gists_url": "https://api.github.com/users/junminahn/gists{/gist_id}",
//         "gravatar_id": "",
//         "html_url": "https://github.com/junminahn",
//         "id": 36021827,
//         "login": "junminahn",
//         "node_id": "MDQ6VXNlcjM2MDIxODI3",
//         "organizations_url": "https://api.github.com/users/junminahn/orgs",
//         "received_events_url": "https://api.github.com/users/junminahn/received_events",
//         "repos_url": "https://api.github.com/users/junminahn/repos",
//         "site_admin": false,
//         "starred_url": "https://api.github.com/users/junminahn/starred{/owner}{/repo}",
//         "subscriptions_url": "https://api.github.com/users/junminahn/subscriptions",
//         "type": "User",
//         "url": "https://api.github.com/users/junminahn"
//       }
//     },
//     "repository": {
//       "archive_url": "https://api.github.com/repos/junminahn/testteste/{archive_format}{/ref}",
//       "archived": false,
//       "assignees_url": "https://api.github.com/repos/junminahn/testteste/assignees{/user}",
//       "blobs_url": "https://api.github.com/repos/junminahn/testteste/git/blobs{/sha}",
//       "branches_url": "https://api.github.com/repos/junminahn/testteste/branches{/branch}",
//       "clone_url": "https://github.com/junminahn/testteste.git",
//       "collaborators_url": "https://api.github.com/repos/junminahn/testteste/collaborators{/collaborator}",
//       "comments_url": "https://api.github.com/repos/junminahn/testteste/comments{/number}",
//       "commits_url": "https://api.github.com/repos/junminahn/testteste/commits{/sha}",
//       "compare_url": "https://api.github.com/repos/junminahn/testteste/compare/{base}...{head}",
//       "contents_url": "https://api.github.com/repos/junminahn/testteste/contents/{+path}",
//       "contributors_url": "https://api.github.com/repos/junminahn/testteste/contributors",
//       "created_at": "2021-03-25T18:14:07Z",
//       "default_branch": "example",
//       "deployments_url": "https://api.github.com/repos/junminahn/testteste/deployments",
//       "description": null,
//       "disabled": false,
//       "downloads_url": "https://api.github.com/repos/junminahn/testteste/downloads",
//       "events_url": "https://api.github.com/repos/junminahn/testteste/events",
//       "fork": false,
//       "forks": 0,
//       "forks_count": 0,
//       "forks_url": "https://api.github.com/repos/junminahn/testteste/forks",
//       "full_name": "junminahn/testteste",
//       "git_commits_url": "https://api.github.com/repos/junminahn/testteste/git/commits{/sha}",
//       "git_refs_url": "https://api.github.com/repos/junminahn/testteste/git/refs{/sha}",
//       "git_tags_url": "https://api.github.com/repos/junminahn/testteste/git/tags{/sha}",
//       "git_url": "git://github.com/junminahn/testteste.git",
//       "has_downloads": true,
//       "has_issues": true,
//       "has_pages": false,
//       "has_projects": true,
//       "has_wiki": true,
//       "homepage": null,
//       "hooks_url": "https://api.github.com/repos/junminahn/testteste/hooks",
//       "html_url": "https://github.com/junminahn/testteste",
//       "id": 351533207,
//       "issue_comment_url": "https://api.github.com/repos/junminahn/testteste/issues/comments{/number}",
//       "issue_events_url": "https://api.github.com/repos/junminahn/testteste/issues/events{/number}",
//       "issues_url": "https://api.github.com/repos/junminahn/testteste/issues{/number}",
//       "keys_url": "https://api.github.com/repos/junminahn/testteste/keys{/key_id}",
//       "labels_url": "https://api.github.com/repos/junminahn/testteste/labels{/name}",
//       "language": "JavaScript",
//       "languages_url": "https://api.github.com/repos/junminahn/testteste/languages",
//       "license": null,
//       "merges_url": "https://api.github.com/repos/junminahn/testteste/merges",
//       "milestones_url": "https://api.github.com/repos/junminahn/testteste/milestones{/number}",
//       "mirror_url": null,
//       "name": "testteste",
//       "node_id": "MDEwOlJlcG9zaXRvcnkzNTE1MzMyMDc=",
//       "notifications_url": "https://api.github.com/repos/junminahn/testteste/notifications{?since,all,participating}",
//       "open_issues": 2,
//       "open_issues_count": 2,
//       "owner": {
//         "avatar_url": "https://avatars.githubusercontent.com/u/36021827?v=4",
//         "events_url": "https://api.github.com/users/junminahn/events{/privacy}",
//         "followers_url": "https://api.github.com/users/junminahn/followers",
//         "following_url": "https://api.github.com/users/junminahn/following{/other_user}",
//         "gists_url": "https://api.github.com/users/junminahn/gists{/gist_id}",
//         "gravatar_id": "",
//         "html_url": "https://github.com/junminahn",
//         "id": 36021827,
//         "login": "junminahn",
//         "node_id": "MDQ6VXNlcjM2MDIxODI3",
//         "organizations_url": "https://api.github.com/users/junminahn/orgs",
//         "received_events_url": "https://api.github.com/users/junminahn/received_events",
//         "repos_url": "https://api.github.com/users/junminahn/repos",
//         "site_admin": false,
//         "starred_url": "https://api.github.com/users/junminahn/starred{/owner}{/repo}",
//         "subscriptions_url": "https://api.github.com/users/junminahn/subscriptions",
//         "type": "User",
//         "url": "https://api.github.com/users/junminahn"
//       },
//       "private": true,
//       "pulls_url": "https://api.github.com/repos/junminahn/testteste/pulls{/number}",
//       "pushed_at": "2021-06-06T23:29:54Z",
//       "releases_url": "https://api.github.com/repos/junminahn/testteste/releases{/id}",
//       "size": 1,
//       "ssh_url": "git@github.com:junminahn/testteste.git",
//       "stargazers_count": 0,
//       "stargazers_url": "https://api.github.com/repos/junminahn/testteste/stargazers",
//       "statuses_url": "https://api.github.com/repos/junminahn/testteste/statuses/{sha}",
//       "subscribers_url": "https://api.github.com/repos/junminahn/testteste/subscribers",
//       "subscription_url": "https://api.github.com/repos/junminahn/testteste/subscription",
//       "svn_url": "https://github.com/junminahn/testteste",
//       "tags_url": "https://api.github.com/repos/junminahn/testteste/tags",
//       "teams_url": "https://api.github.com/repos/junminahn/testteste/teams",
//       "trees_url": "https://api.github.com/repos/junminahn/testteste/git/trees{/sha}",
//       "updated_at": "2021-06-06T23:29:57Z",
//       "url": "https://api.github.com/repos/junminahn/testteste",
//       "watchers": 0,
//       "watchers_count": 0
//     },
//     "sender": {
//       "avatar_url": "https://avatars.githubusercontent.com/u/36021827?v=4",
//       "events_url": "https://api.github.com/users/junminahn/events{/privacy}",
//       "followers_url": "https://api.github.com/users/junminahn/followers",
//       "following_url": "https://api.github.com/users/junminahn/following{/other_user}",
//       "gists_url": "https://api.github.com/users/junminahn/gists{/gist_id}",
//       "gravatar_id": "",
//       "html_url": "https://github.com/junminahn",
//       "id": 36021827,
//       "login": "junminahn",
//       "node_id": "MDQ6VXNlcjM2MDIxODI3",
//       "organizations_url": "https://api.github.com/users/junminahn/orgs",
//       "received_events_url": "https://api.github.com/users/junminahn/received_events",
//       "repos_url": "https://api.github.com/users/junminahn/repos",
//       "site_admin": false,
//       "starred_url": "https://api.github.com/users/junminahn/starred{/owner}{/repo}",
//       "subscriptions_url": "https://api.github.com/users/junminahn/subscriptions",
//       "type": "User",
//       "url": "https://api.github.com/users/junminahn"
//     }
//   },
//   "eventName": "issues",
//   "sha": "337e35a0a0bef0a346affa22025a3936895b3486",
//   "ref": "refs/heads/example",
//   "workflow": "Issue",
//   "action": "actionsgithub-script",
//   "actor": "junminahn",
//   "job": "iss",
//   "runNumber": 7,
//   "runId": 912907693
// }
