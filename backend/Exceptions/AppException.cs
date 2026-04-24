using System;

namespace QLCT.Exceptions
{
    public class AppException : Exception
    {
        public string ErrorCode { get; }

        public AppException(string errorCode) : base(errorCode)
        {
            ErrorCode = errorCode;
        }
        
        public AppException(string errorCode, string message) : base(message)
        {
            ErrorCode = errorCode;
        }
    }
}