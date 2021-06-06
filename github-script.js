const fs = require('fs');
const yaml = require('js-yaml');

// This module runs in GitHub Action `github-script`
// see https://github.com/actions/github-script#run-a-separate-file-with-an-async-function
module.exports = ({ github, context }) => {
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  // console.log('github', JSON.stringify(github, null, 2));
  // console.log('content', JSON.stringify(context, null, 2));

  const patt = new RegExp('```yml((.|\n)*?)```', 'g');

  let content = context.payload.issue.body;
  console.log(content);

  m = patt.exec(content);

  if (m) {
    content = m[1];
  }

  try {
    console.log(content);
    const doc = yaml.load(content);
    console.log(JSON.stringify(doc));
  } catch (e) {
    console.log(e);
  }

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
