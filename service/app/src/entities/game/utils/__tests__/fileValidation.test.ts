import { describe, expect,it } from 'vitest';

import { validateImageFile,validateMultipleFiles } from '../fileValidation';

const createDummyFile = (name: string, type = 'image/png', size = 1000): File => {
  const blob = new Blob(['a'.repeat(size)], { type });
  return new File([blob], name, { type });
};

describe('validateImageFile', () => {
    it('유효한 이미지 파일이면 성공해야 한다', () => {
      const file = createDummyFile('test.png', 'image/png');
      const result = validateImageFile(file);
      expect(result.isValid).toBe(true);
    });
  
    it('지원하지 않는 파일 타입이면 실패해야 한다', () => {
      const file = createDummyFile('test.gif', 'image/gif');
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('지원하지 않는 파일 형식입니다');
    });
  
    it('파일 크기가 제한을 초과하면 실패해야 한다', () => {
      const file = createDummyFile('big.png', 'image/png', 11 * 1024 * 1024);
      const result = validateImageFile(file);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('파일 크기가 너무 큽니다');
    });
  });

describe('validateMultipleFiles', () => {
  it('모든 파일이 유효할 때 성공해야 한다', () => {
    const files = [
      createDummyFile('img1.png'),
      createDummyFile('img2.jpg'),
    ];
    const result = validateMultipleFiles(files);
    expect(result.isValid).toBe(true);
  });

  it('올바르지 않은 파일 확장자가 있으면 실패해야 한다', () => {
    const files = [
      createDummyFile('img1.txt', 'text/plain'),
      createDummyFile('img2.png'),
    ];
    const result = validateMultipleFiles(files);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('지원하지 않는 파일 형식입니다');
  });

  it('파일 사이즈가 너무 크면 실패해야 한다', () => {
    const bigFile = createDummyFile('big.png', 'image/png', 11 * 1024 * 1024);
    const result = validateMultipleFiles([bigFile]);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('파일 크기가 너무 큽니다');
  });

  it('빈 배열일 때 성공해야 한다', () => {
    const result = validateMultipleFiles([]);
    expect(result.isValid).toBe(true);
  });
});
