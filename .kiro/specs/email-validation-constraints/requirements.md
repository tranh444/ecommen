# Requirements Document

## Introduction

Hệ thống cần đảm bảo rằng mỗi email chỉ có thể được đăng ký một lần duy nhất trong hệ thống. Điều này bao gồm việc kiểm tra email trùng lặp trước khi tạo tài khoản mới và xử lý các trường hợp edge case như email đã bị xóa mềm.

## Requirements

### Requirement 1

**User Story:** Là một người dùng, tôi muốn hệ thống ngăn chặn việc đăng ký với email đã tồn tại, để đảm bảo tính duy nhất của tài khoản.

#### Acceptance Criteria

1. WHEN người dùng cố gắng đăng ký với email đã tồn tại THEN hệ thống SHALL trả về lỗi ConflictException với message "Email đã tồn tại"
2. WHEN người dùng đăng ký với email mới THEN hệ thống SHALL tạo tài khoản thành công
3. WHEN email đã tồn tại nhưng tài khoản đã bị xóa mềm (deletedAt không null) THEN hệ thống SHALL cho phép đăng ký lại với email đó

### Requirement 2

**User Story:** Là một developer, tôi muốn có validation ở cả database level và application level, để đảm bảo tính toàn vẹn dữ liệu.

#### Acceptance Criteria

1. WHEN có unique constraint violation ở database level THEN application SHALL bắt được Prisma error P2002 và xử lý phù hợp
2. WHEN có lỗi xảy ra trong quá trình kiểm tra email THEN hệ thống SHALL log error và trả về response phù hợp
3. IF email validation thất bại THEN hệ thống SHALL không tạo user record trong database

### Requirement 3

**User Story:** Là một người dùng, tôi muốn nhận được thông báo lỗi rõ ràng khi email đã được sử dụng, để biết cách xử lý tiếp theo.

#### Acceptance Criteria

1. WHEN email đã tồn tại THEN response SHALL có status code 409 (Conflict)
2. WHEN email đã tồn tại THEN response message SHALL là "Email đã tồn tại" bằng tiếng Việt
3. WHEN có lỗi validation khác THEN hệ thống SHALL trả về message lỗi phù hợp
