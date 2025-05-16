import { renderHook, act } from "@testing-library/react";
import {
  useFileUpload,
  FileUploadResponse,
  FileUploadWithLink,
} from "@/app/hooks/useFileUpload";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

const mockFetch = vi.fn();
global.fetch = mockFetch;

class MockFormData implements FormData {
  append = vi.fn();
  delete = vi.fn();
  get = vi.fn();
  getAll = vi.fn();
  has = vi.fn();
  set = vi.fn();
  forEach = vi.fn();
  entries = vi.fn(() => [][Symbol.iterator]());
  keys = vi.fn(() => [][Symbol.iterator]());
  values = vi.fn(() => [][Symbol.iterator]());
  [Symbol.iterator] = vi.fn(() => [][Symbol.iterator]());
}

const mockFormDataInstance = new MockFormData();

global.FormData = vi.fn(
  () => mockFormDataInstance
) as unknown as typeof FormData;

describe("useFileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFormDataInstance.append.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("uploadFile", () => {
    it("should upload a file successfully", async () => {
      // GIVEN
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const mockDate = new Date("2023-01-01");
      const mockCategory = "documents";

      const mockUploadResponse: FileUploadResponse = {
        key: "file-123",
        mimeType: "text/plain",
        originalName: "test.txt",
        id: 1,
        fileSize: 12,
      };

      const mockDownloadUrl = "https://example.com/files/file-123";

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockUploadResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ url: mockDownloadUrl }),
        });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      let uploadResult: FileUploadWithLink | undefined;
      await act(async () => {
        uploadResult = await result.current.uploadFile(
          mockFile,
          mockDate,
          mockCategory
        );
      });

      // THEN
      // Verify FormData append calls
      expect(mockFormDataInstance.append).toHaveBeenCalledWith(
        "file",
        mockFile
      );
      expect(mockFormDataInstance.append).toHaveBeenCalledWith(
        "date",
        mockDate.toString()
      );
      expect(mockFormDataInstance.append).toHaveBeenCalledWith(
        "category",
        mockCategory
      );

      // Verify fetch calls
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1, "/api/files", {
        method: "POST",
        body: mockFormDataInstance,
      });
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        "/api/files?fileName=file-123"
      );
      expect(uploadResult).toEqual({
        ...mockUploadResponse,
        fileUrl: mockDownloadUrl,
      });
    });

    it("should throw an error when upload fails", async () => {
      // GIVEN
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });
      const mockDate = new Date("2023-01-01");
      const mockCategory = "documents";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Upload failed" }),
      });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      // THEN
      await expect(
        result.current.uploadFile(mockFile, mockDate, mockCategory)
      ).rejects.toThrow("Upload failed");

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("getFile", () => {
    it("should get a file successfully", async () => {
      // GIVEN
      const fileKey = "file-123";

      const mockFileResponse: FileUploadResponse = {
        key: fileKey,
        mimeType: "text/plain",
        originalName: "test.txt",
        id: 1,
        fileSize: 12,
      };

      const mockDownloadUrl = "https://example.com/files/file-123";

      mockFetch
        .mockResolvedValueOnce({
          json: () => Promise.resolve(mockFileResponse),
        })
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ url: mockDownloadUrl }),
        });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      let fileResult: FileUploadWithLink | undefined;
      await act(async () => {
        fileResult = await result.current.getFile(fileKey);
      });

      // THEN
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        `/api/files/${encodeURIComponent(fileKey)}`
      );
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        `/api/files?fileName=${fileKey}`
      );
      expect(fileResult).toEqual({
        ...mockFileResponse,
        fileUrl: mockDownloadUrl,
      });
    });
  });

  describe("getDownloadLink", () => {
    it("should get a download link successfully", async () => {
      // GIVEN
      const fileName = "file-123";
      const mockDownloadUrl = "https://example.com/files/file-123";

      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ url: mockDownloadUrl }),
      });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      let downloadUrl: string | undefined;
      await act(async () => {
        downloadUrl = await result.current.getDownloadLink(fileName);
      });

      // THEN
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(`/api/files?fileName=${fileName}`);
      expect(downloadUrl).toEqual(mockDownloadUrl);
    });
  });

  describe("deleteFile", () => {
    it("should delete a file successfully", async () => {
      // GIVEN
      const fileKey = "file-123";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.deleteFile(fileKey);
      });

      // THEN
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        `/api/files/${encodeURIComponent(fileKey)}/delete`,
        {
          method: "DELETE",
        }
      );
    });

    it("should throw an error when delete fails", async () => {
      // GIVEN
      const fileKey = "file-123";

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: "Delete failed" }),
      });

      // WHEN
      const { result } = renderHook(() => useFileUpload());

      // THEN
      await expect(result.current.deleteFile(fileKey)).rejects.toThrow(
        "Delete failed"
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
