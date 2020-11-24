pragma solidity >=0.5.0 <0.8.0;

interface Token {
    /// @notice 주어진 토큰오너에 대한 잔액조회
    /// @param _owner 잔액이 회수될 주소
    /// @return balance 갖고있는 잔고
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @notice 'msg.sender'에서 '_to'로 '_value'만큼 토큰을 전송한다
    /// @param _to 수신할 주소
    /// @param _value 전송할 토큰의 양
    /// @return success 성공 여부에 대한 반환
    function transfer(address _to, uint256 _value) external returns (bool success);

    /// @notice '_from'의 승인하에 '_value'만큼의 토큰을 '_from'에서 '_to'로 전송한다
    /// @param _from 발신할 주소
    /// @param _to 수신할 주소
    /// @param _value 전송할 토큰의 양
    /// @return success 성공 여부에 대한 반환
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

    /// @notice 'msg.sender'가 '_spender'에게 '_value'만큼의 토큰을 쓰도록 허가한다
    /// @param _spender 토큰을 전송할 수 있는 계정의 주소
    /// @param _value 전달 승인 웨이(Wei)의 양
    /// @return success 성공 여부에 대한 반환
    function approve(address _spender, uint256 _value) external returns (bool success);

    /// @notice '_spender'가 '_owner'에서 인출할 수 있는 금액을 반환함
    /// @param _owner 토큰을 소유한 계정 주소
    /// @param _spender 트랜잭션을 실행하는 계정의 주소
    /// @return remaining 사용할 수 있는 나머지 토큰의 양
    function allowance(address _owner, address _spender) external view returns (uint256 remaining);

    // 전송 이벤트
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // 승인 이벤트
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}