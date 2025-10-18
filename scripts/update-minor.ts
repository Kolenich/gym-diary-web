import { execSync } from 'child_process';

import { version } from '../package.json';

function updateMinor(): void {
  try {
    console.log(`Текущая версия: ${version}`);
    const tagName = `v${version}`;
    console.log(`Создание тега: ${tagName}`);

    execSync(`git tag ${tagName}`, { stdio: 'inherit' });

    console.log('Обновление версии на minor');
    execSync('npm version minor --no-commit-hooks --no-git-tag-version', { stdio: 'inherit' });

    console.log('Версионирование успешно завершено');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Произошла ошибка:', error.message);
    } else {
      console.error('Произошла неизвестная ошибка');
    }
    process.exit(1);
  }
}

updateMinor();
