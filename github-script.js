const fs = require('fs');

// This module runs in GitHub Action `github-script`
// see https://github.com/actions/github-script#run-a-separate-file-with-an-async-function
module.exports = ({ github, context }) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  console.log('github', JSON.stringify(github, null, 2));
  console.log('content', JSON.stringify(context, null, 2));

  // await github.issues.create({
  //   owner,
  //   repo,
  //   title: 'negajjang',
  // });

  // If we don't have a main branch we won't have anywhere
  // to merge the PR.
  // const mainbr = await context.github.git.getRef({
  //   owner,
  //   repo,
  //   ref: `heads/${context.payload.repository.default_branch}`,
  // });

  // Create a branch to commit to commit the license file
  // await github.git.createRef({
  //   owner,
  //   repo,
  //   ref: `refs/heads/newbranch`,
  //   sha: '',
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

  // return context;
};
